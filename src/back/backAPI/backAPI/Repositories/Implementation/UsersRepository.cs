using backAPI.Data;
using backAPI.Entities.Domain;
using backAPI.DTO;
using backAPI.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Xml.Linq;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Repositories.Implementation {
    public class UsersRepository : IUsersRepository {

        private readonly DataContext dataContext;
        private readonly IConfiguration configuration;
        private readonly ICompanyRolesRepository companyRolesRepository;

        /* **********************************************************************************
         * Konstruktor
         * ********************************************************************************** */
        public UsersRepository(DataContext dataContext, IConfiguration configuration, ICompanyRolesRepository companyRolesRepository) { 
            this.dataContext = dataContext;
            this.configuration = configuration;
            this.companyRolesRepository = companyRolesRepository;
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
         * GetUserByEmail
         * ********************************************************************************** */
        public async Task<User> GetUserByEmail(string email) {
            return await dataContext.Users.SingleOrDefaultAsync(user => user.Email == email);
        }

        /* **********************************************************************************
         * GetUserByUsername
         * ********************************************************************************** */
        public async Task<User> GetUserByUsername(string username) {
            return await dataContext.Users.SingleOrDefaultAsync(user => user.Username == username);
        }

        /* **********************************************************************************
         * DeleteUser
         * ********************************************************************************** */
        public async Task<bool> DeleteUser(string username) {
            var user = await GetUserByUsername(username);

            if(user == null) {
                return false;
            }

            // TO DO: Potrebno obezbediti kaskadno brisanje podataka vezanih za ovog korisnika

            dataContext.Users.Remove(user);
            await dataContext.SaveChangesAsync(true);

            return true;
        }
        /* **********************************************************************************
         * Update user
         * ********************************************************************************** */
        public async Task<bool> UpdateUser(string username, UserDto request) {
            var user = await GetUserByUsername(username);

            // ne postoji user
            if (user == null) {
                return false;
            }

            user.Username = request.Username;
            user.Email = request.Email;
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.CompanyRoleId = companyRolesRepository.GetCompanyRoleByNameAsync(request.CompanyRoleName).Result.Id;
            user.ProfilePhoto = request.ProfilePhoto;
            user.Address = request.Address;
            user.ContactPhone = request.ContactPhone;
            user.LinkedinProfile = request.LinkedinProfile;
            user.Status = request.Status;
            user.IsVerified = request.IsVerified;
            user.PreferedLanguage = request.PreferedLanguage;

            await dataContext.SaveChangesAsync();

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

        public async Task<string> IdToUsername(int id) {
            var user = await dataContext.Users.FirstOrDefaultAsync(user => user.Id == id);
            if(user == null) {
                return null;
            }
            return user.Username;
        }

        // Implementacija metode za proveru da li korisnik postoji u bazi preko korisnickog imena
        public async Task<bool> UserExistsByUsername(string username)
        {
            return await dataContext.Users.AnyAsync(x => x.Username == username);
        }

        // Implementacija metode za proveru da li korisnik postoji u bazi preko email-a
        public async Task<bool> UserExistsByEmail(string email)
        {
            return await dataContext.Users.AnyAsync(x => x.Email == email);
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
