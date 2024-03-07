using backAPI.Data;
using backAPI.DTOs;
using backAPI.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace backAPI.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;

        // TODO: Dodati servis za JWT
        public AccountController(DataContext context)
        {
            _context = context;
        }

        [HttpPost("register")] // POST: api/account/register, body {RegisterDto)
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            // proveriti da li u bazi postoji korisnik sa istim username-om
            // ukoliko postoji vratiti 404 Bad Request
            if (await UserExists(registerDto.Username))
            {
                return BadRequest("Username is taken");
            }

            // hesirati sifru koja je stigla za registraciju i kreirati i salt kao Key generisan
            // preko random vrednosti
            using var hmac = new HMACSHA512();
            var user = new User
            {
                Username = registerDto.Username,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };

            _context.Users.Add(user);
            // sacuvati korisnika u bazi
            await _context.SaveChangesAsync();

            // TODO: dodati servis koji ce da kreira token i vrati kroz DTO
            return new UserDto
            {
                Username = user.Username,
                Token = ""
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.Username == loginDto.Username);

            // ukoliko nema unosa u bazi, vratiti 401 Unauthorized
            if (user == null) return Unauthorized("invalid username");

            // koristimo pass_salt sacuvan u bazi da bismo obezbedili da ce sifra na isti nacin biti hesirana
            using var hmac = new HMACSHA512(user.PasswordSalt);
            byte[] computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                // ako nema potpunog poklapanja vratiti 401 Unauthorized
                if (computedHash[i] != user.PasswordHash[i])
                    return Unauthorized("invalid password");
            }

            // TODO: dodati servis koji ce da kreira token i vrati kroz DTO
            return new UserDto
            {
                Username = user.Username,
                Token = ""
            };
        }

        /// <summary>
        /// Metoda koja proverava da li je korisnik sacuvan u bazi
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.Username == username.ToLower());
        }
    }
}
