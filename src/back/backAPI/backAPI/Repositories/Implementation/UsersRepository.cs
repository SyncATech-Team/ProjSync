using backAPI.Data;
using backAPI.Entities.Domain;
using backAPI.Entities.DTO;
using backAPI.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace backAPI.Repositories.Implementation {
    public class UsersRepository : IUsersRepository {

        private readonly DataContext dataContext;
        private readonly IConfiguration configuration;

        /* **********************************************************************************
         * Konstruktor
         * ********************************************************************************** */
        public UsersRepository(DataContext dataContext, IConfiguration configuration) { 
            this.dataContext = dataContext;
            this.configuration = configuration;
        }
        /* **********************************************************************************
         * GetUsersAsync
         * ********************************************************************************** */
        public async Task<IEnumerable<User>> GetUsersAsync() {
            return await dataContext.Users.ToListAsync();
        }
        /* **********************************************************************************
         * RegisterUser
         * ********************************************************************************** */
        public async Task<User> RegisterUser(User user) {

            await dataContext.Users.AddAsync(user);
            await dataContext.SaveChangesAsync();

            return user;
        }

        /* **********************************************************************************
         * GetUser
         * ********************************************************************************** */
        public async Task<User> GetUser(string email) {
            return await dataContext.Users.SingleOrDefaultAsync(user => user.Email == email);
        }

        /* **********************************************************************************
         * DeleteUser
         * ********************************************************************************** */
        public async Task<bool> DeleteUser(int id) {
            var user = await dataContext.Users.FindAsync(id);

            if(user == null) {
                return false;
            }

            // TO DO: Potrebno obezbediti kaskadno brisanje podataka vezanih za ovog korisnika

            dataContext.Users.Remove(user);
            await dataContext.SaveChangesAsync(true);

            return true;
        }
        /* **********************************************************************************
         * UsernameToId
         * ********************************************************************************** */
        public async Task<int> UsernameToId(string username) {
            var user = await dataContext.Users.FirstOrDefaultAsync(user => user.Username == username);
            if(user == null) {
                return -1;
            }
            return user.Id;
        }
        /* **********************************************************************************
         * EmailToId
         * ********************************************************************************** */
        public async Task<int> EmailToId(string email) {
            var user = await dataContext.Users.FirstOrDefaultAsync(user => user.Email == email);
            if(user == null) {
                return -1;
            }
            return user.Id;
        }

        /* ****************************************************************************************************************************** */
        /* ****************************************************************************************************************************** */
        /* ********************************************** PRIVATE HELPER METHODS ******************************************************** */
        /* ****************************************************************************************************************************** */
        /* ****************************************************************************************************************************** */

        /* **********************************************************************************
         * Create password hash & salt
         * ********************************************************************************** */
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt) {
            using (var hmac = new HMACSHA512()) {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
        /* **********************************************************************************
         * Check password hash
         * ********************************************************************************** */
        private Boolean CheckPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt) {
            using (var hmac = new HMACSHA512(passwordSalt)) {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }
        /* **********************************************************************************
         * Create security token
         * ********************************************************************************** */
        private string CreateToken(User user) {
            var fullName = user.FirstName + " " + user.LastName;
            string uid = "" + user.Id;
            List<Claim> claims = new List<Claim>()
            {
                new Claim("username",user.Username ),
                new Claim("email",user.Email ),
                new Claim("imeprezime",fullName),
                new Claim("id",uid)
            };
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(configuration.GetSection("AppSettings1:Token").Value));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: cred);
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }
        /* **********************************************************************************
         * Create email token
         * ********************************************************************************** */
        private string CreateEmailToken(string username, int expiretime) {
            List<Claim> claims = new List<Claim>()
            {
                new Claim("username",username),
            };
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(configuration.GetSection("AppSettings2:Token").Value));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(expiretime),
                signingCredentials: cred);
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }
    }
}
