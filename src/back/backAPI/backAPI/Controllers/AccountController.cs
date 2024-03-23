using backAPI.Data;
using backAPI.DTO;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using backAPI.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using backAPI.DTO.Login;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

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
        public async Task<ActionResult> Register(RegisterDto registerDto)
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
                IsVerified = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                IsActive = true
            };

            // sacuvati korisnika u bazi
            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user, "Worker");
            if (!roleResult.Succeeded) return BadRequest(roleResult.Errors);

            // poslati registacioni mejl
            // _emailService.SendSuccessfullRegistrationEmail(user.Email, user.UserName);

            return Ok(new UserDto {
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


        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users.SingleOrDefaultAsync(x => x.Email == loginDto.Email);

            // ukoliko nema unosa u bazi, vratiti 401 Unauthorized
            if (user == null) return Unauthorized("invalid credentials!");
            if (user.IsActive == false) return Unauthorized("User is not active");

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!result) return Unauthorized();

            return new LoginResponseDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user)
            };
        }

        private async Task<bool> UserExists(string username)
        {
            // check if there is user in database already
            return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}
