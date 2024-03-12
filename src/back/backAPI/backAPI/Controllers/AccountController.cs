using backAPI.Data;
using backAPI.DTO;
using backAPI.Entities.Domain;
using backAPI.Repositories.Implementation;
using backAPI.Repositories.Interface;
using backAPI.Services.Interface;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using backAPI.Services.Implementation;


namespace backAPI.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        private readonly IUsersRepository _usersRepository;
        private readonly ICompanyRolesRepository _companyRolesRepository;
        private readonly IEmailService _emailService;

        public AccountController(DataContext context, ITokenService tokenService, 
            IUsersRepository usersRepository, ICompanyRolesRepository companyRolesRepository,
            IEmailService emailService)
        {
            _context = context;
            _tokenService = tokenService;
            _usersRepository = usersRepository;
            _companyRolesRepository = companyRolesRepository;
            _emailService = emailService;
        }

        [HttpPost("register")] // POST: api/account/register
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            if (await _usersRepository.UserExistsByUsername(registerDto.Username))
                return BadRequest("Username is taken");

            if (await _usersRepository.UserExistsByEmail(registerDto.Email)) 
                return BadRequest("Email is taken");

            // zameniti naziv role u id
            CompanyRole companyRole = await _companyRolesRepository.GetCompanyRoleByNameAsync(registerDto.CompanyRole);
            if (companyRole == null)
            {
                return BadRequest("Company Role with this name can't be fatched");
            }
            int companyRoleId = companyRole.Id;

            // hesirati sifru koja je stigla za registraciju i kreirati i salt kao Key generisan
            // preko random vrednosti
            using var hmac = new HMACSHA512();

            // kreiranje novog korisnika u tabeli User
            var user = new User
            {
                Username = registerDto.Username,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key,
                Email = registerDto.Email,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                CompanyRoleId = companyRoleId,
                Address = registerDto.Address,
                ContactPhone = registerDto.ContactPhone,
                LinkedinProfile = registerDto.LinkedinProfile,
                Status = registerDto.Status
            };

            // sacuvati korisnika u bazi
            await _usersRepository.RegisterUser(user);

            // poslati registacioni mejl
            _emailService.SendSuccessfullRegistrationEmail(user.Email, user.Username);

            return Ok();
        }


        /*        [HttpPost("login")]
                public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
                {
                    var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == loginDto.Username);

                    if (user == null) return Unauthorized("invalid username");

                    // pass key to be identical algs
                    using var hmac = new HMACSHA512(user.PasswordSalt);
                    byte[] computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

                    for (int i = 0; i < computedHash.Length; i++)
                    {
                        if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("invalid password");
                    }

                    return new UserDto
                    {
                        Username = user.UserName,
                        Token = _tokenService.CreateToken(user)
                    };
                }*/
    }
}
