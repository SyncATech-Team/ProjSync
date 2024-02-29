using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace API.Controllers
{
    /// <summary>
    /// Account kontroler - nalazi se na putanji /api/account
    /// ima dva endpointa POST za login i registraciju korisnika
    /// </summary>
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;

        public AccountController(DataContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        /// <summary>
        /// Endpoint preko koga registrujemo novog korisnika
        /// Ukoliko je sve u redu, korisnik se upisuje u bazu, a iz metode se vraca DTO kao potvrdu da je sve
        /// proslo do kraja. DTO sadrzi i jwt token
        /// </summary>
        /// <param name="registerDto"></param>
        /// <returns></returns>
        [HttpPost("register")] // POST: api/account/register
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {

            if (await UserExists(registerDto.Username))
            {
                return BadRequest("Korisnicko ime je zauzeto!");
            }

            // kada cuvamo podatke u bazu, za sifru nije dovoljno da cuvamo samo hash (za iste sifre isti je hash)
            // zato dodatno cuvamo PasswordSalt
            using var hmac = new HMACSHA512();
            var user = new AppUser
            {
                UserName = registerDto.Username,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }

        /// <summary>
        /// Endpoint preko kojeg se korisnik login-uje
        /// Ukoliko je login uspesan, korisniku se vraca jwt token koji moze dalje da koristi u zahtevima
        /// </summary>
        /// <param name="loginDto"></param>
        /// <returns></returns>
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == loginDto.Username);

            if (user == null) return Unauthorized("Pogresno korisnicko ime");

            // konstruktoru prosledjujemo isti kljuc da bi obezbedili da se hash racuna
            // na isti nacin za upisanog korisnika i pristiglu sifru
            using var hmac = new HMACSHA512(user.PasswordSalt);
            byte[] computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i])
                    return Unauthorized("Pogresna lozinka");
            }

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }

        // Metoda za proveru da li je korisnik vec u bazi
        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}

