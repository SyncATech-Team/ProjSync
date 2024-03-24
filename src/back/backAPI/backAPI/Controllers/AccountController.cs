using backAPI.Data;
using backAPI.DTO;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using backAPI.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using backAPI.DTO.Login;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using backAPI.DTO.ResetPassword;

namespace backAPI.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IUsersRepository _usersRepository;
        private readonly ICompanyRolesRepository _companyRolesRepository;
        private readonly IEmailService _emailService;

        public AccountController(UserManager<User> userManager, ITokenService tokenService, 
            IUsersRepository usersRepository, ICompanyRolesRepository companyRolesRepository,
            IEmailService emailService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _usersRepository = usersRepository;
            _companyRolesRepository = companyRolesRepository;
            _emailService = emailService;
        }

        [HttpPost("register")] // POST: api/account/register
        public async Task<ActionResult<string>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.UserName)) return BadRequest("Username is taken");
            
            // zameniti naziv role u id
            CompanyRole companyRole = await _companyRolesRepository.GetCompanyRoleByNameAsync(registerDto.CompanyRole);
            if (companyRole == null)
            {
                return BadRequest("Company Role with this name can't be fatched");
            }
            int companyRoleId = companyRole.Id;

            // kreiranje novog korisnika u tabeli User
            var user = new User
            {
                UserName = registerDto.UserName.ToLower(),
                Email = registerDto.Email,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                CompanyRoleId = companyRoleId,
                Address = registerDto.Address,
                ContactPhone = registerDto.ContactPhone,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                IsActive = true
            };

            // sacuvati korisnika u bazi
            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user, "Worker");
            if (!roleResult.Succeeded) return BadRequest(roleResult.Errors);

            // kreiranje tokena za verifikaciju email-a
            var confirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            // Obavzeno enkodovati token!
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(confirmationToken));
            var conformationLink = $"http://localhost:4200/account/confirm-email?email={registerDto.Email}&token={encodedToken}";

            // Samo trenutno dok se potpuno ne osposobi email servis
            Console.WriteLine("[conformationLink]: " + confirmationToken);

            // poslati registacioni mejl
            // _emailService.SendToConfirmEmail(registerDto.Email, registerDto.UserName, conformationLink);

            return Ok(new UserDto
            {
                Username = user.UserName,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                CompanyRoleName = registerDto.CompanyRole,
                Address = user.Address,
                ContactPhone = user.ContactPhone,
                IsVerified = user.IsVerified,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            });
        }

        [HttpPost("confirm-email")]
        public async Task<ActionResult<ResetPasswordAfterEmailConfirmationDto>> ConfirmEmail([FromQuery]string email, [FromQuery]string token)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user != null)
            {
                // enkodovan token dekodirati
                var decodedToken = System.Text.Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));

                var result = await _userManager.ConfirmEmailAsync(user, decodedToken);
                if (result.Succeeded)
                {
                    // posto je sve u redu, nastaviti sa resetovanje sifre
                    var resetPassToken = await _userManager.GeneratePasswordResetTokenAsync(user);
                    ResetPasswordAfterEmailConfirmationDto response = new ResetPasswordAfterEmailConfirmationDto
                    {
                        Token = resetPassToken,
                        Email = email
                    };
                    return response;
                }
                else return BadRequest(result.Errors);
            }

            return BadRequest("Failed to confirm mail");
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            // ukoliko nema unosa u bazi, vratiti 401 Unauthorized
            if (user == null) return Unauthorized("invalid credentials!");
            if (user.IsActive == false) return Unauthorized("User is not active");

            if (true /*user.EmailConfirmed zakomentarisano samo dok ne proradi email servis!*/)
            {
                var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);
                if (!result) return Unauthorized();

                return new LoginResponseDto
                {
                    Username = user.UserName,
                    Token = await _tokenService.CreateToken(user)
                };
            }
            else return Unauthorized("Email is not verified");
        }

        private async Task<bool> UserExists(string username)
        {
            // check if there is user in database already
            return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
        }

        [HttpPost("reset-password")]
        public async Task<ActionResult<LoginResponseDto>> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);

            if (user == null) return BadRequest("User is not valid");

            var resetPassResult = await _userManager.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.Password);
            if (!resetPassResult.Succeeded) return BadRequest("Failed to reset password");

            return new LoginResponseDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user)
            };
        }
    }
}
