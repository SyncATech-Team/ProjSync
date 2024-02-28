using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    /// <summary>
    /// Users kontroler - nalazi se na putanji /api/users
    /// za koriscenje endpointa potrebna je autorizacija (jwt token)
    /// </summary>
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly DataContext _context;

        public UsersController(DataContext context)
        {
            _context = context;
        }

        // Asinhorna metoda koja nam vraca listu svih korisnika iz baze
        // za ovu metodu nije potrebna autorizacija
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            List<UserDto> userDtos = new List<UserDto>();
            foreach (var user in users)
            {
                userDtos.Add(new UserDto { Username = user.UserName, Token = "" });
            }

            return userDtos;
        }

        // Asinhorna metoda koja nam vraca korisnika iz baze po id-u
        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetUser(int id)
        {
            return await _context.Users.FindAsync(id);
        }
    }
}