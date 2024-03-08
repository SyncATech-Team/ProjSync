using backAPI.Entities;
using backAPI.Entities.Domain;
using backAPI.Entities.DTO;
using backAPI.Repositories.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace backAPI.Controllers
{
    public class UsersController : BaseApiController
    {
        private readonly IUsersRepository usersRepository;


        // TODO: Dodati servis za JWT
        public UsersController(IUsersRepository usersRepository) {
            this.usersRepository = usersRepository;
        }

        // POST: api/users/register, body {RegisterDTO)
        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
        {
            // proveriti da li u bazi postoji korisnik sa istim username-om
            // ukoliko postoji vratiti 404 Bad Request
            if (await usersRepository.CheckUsernameExistance(registerDTO.Username))
            {
                return BadRequest("Username is taken by another user!");
            }

            // proveriti da li u bazi postoji korisnik sa istim email-om
            // ukoliko postoji vratiti 404 Bad Request
            if (await usersRepository.CheckEmailExistance(registerDTO.UserEmail)) {
                return BadRequest("Email is already used by another user!");
            }

            // hesirati sifru koja je stigla za registraciju i kreirati i salt kao Key generisan
            // preko random vrednosti
            using var hmac = new HMACSHA512();

            // Convert DTO to Domain Model
            var user = new User
            {
                Username = registerDTO.Username,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password)),
                PasswordSalt = hmac.Key,
                UserEmail = registerDTO.UserEmail,
                UserFirstName = registerDTO.UserFirstName,
                UserLastName = registerDTO.UserLastName,
                RoleCompany = registerDTO.RoleCompany,
                UserAddress = registerDTO.UserAddress,
                UserContactPhone = registerDTO.UserContactPhone,
                UserLinkedinProfile = registerDTO.UserLinkedinProfile,
                UserStatus = registerDTO.UserStatus
            };

            // sacuvati korisnika u bazi
            await usersRepository.CreateNewUserAsync(user);

            // Map back from Domain model to DTO | encapsulate clients response
            // TODO: dodati servis koji ce da kreira token i vrati kroz DTO
            return new UserDTO
            {
                Username = user.Username,
                Token = ""
            };
        }


        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
        {
            var user = await usersRepository.GetUserIfExists(loginDTO.UserEmail);

            // ukoliko nema unosa u bazi, vratiti 401 Unauthorized
            if (user == null) return Unauthorized("invalid username");

            // koristimo pass_salt sacuvan u bazi da bismo obezbedili da ce sifra na isti nacin biti hesirana
            using var hmac = new HMACSHA512(user.PasswordSalt);
            byte[] computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTO.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                // ako nema potpunog poklapanja vratiti 401 Unauthorized
                if (computedHash[i] != user.PasswordHash[i])
                    return Unauthorized("invalid password");
            }

            // TODO: dodati servis koji ce da kreira token i vrati kroz DTO
            return new UserDTO
            {
                Username = user.Username,
                Token = ""
            };
        }

        /* *****************************************************************************
         * Delete user
         * ***************************************************************************** */
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeleteUser(int id) {
            var deleted = await usersRepository.DeleteUser(id);

            if(deleted == false) {
                return NotFound("There is no user with specified id");
            }

            return Ok();
        }
    }
}
