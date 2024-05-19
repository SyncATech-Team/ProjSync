using backAPI.Data;
using backAPI.DTO;
using backAPI.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using backAPI.Entities.Domain;
using backAPI.Other.Helpers;
using Newtonsoft.Json.Linq;

namespace backAPI.Repositories.Implementation
{
    public class UsersRepository : IUsersRepository {

        private readonly DataContext dataContext;
        private readonly IConfiguration configuration;
        private readonly ICompanyRolesRepository companyRolesRepository;
        private readonly UserManager<User> userManager;

        /* **********************************************************************************
         * Konstruktor
         * ********************************************************************************** */
        public UsersRepository(DataContext dataContext, IConfiguration configuration, ICompanyRolesRepository companyRolesRepository, UserManager<User> userManager) { 
            this.dataContext = dataContext;
            this.configuration = configuration;
            this.companyRolesRepository = companyRolesRepository;
            this.userManager = userManager;
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
            return await dataContext.Users.SingleOrDefaultAsync(user => user.UserName == username);
        }

        /* **********************************************************************************
         * GetUserById
         * ********************************************************************************** */
        public async Task<User> GetUserById(int id) {
            return await dataContext.Users.SingleOrDefaultAsync(user => user.Id == id);
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

            user.IsActive = false;
            user.UpdatedAt = DateTime.Now;
            await dataContext.SaveChangesAsync(true);

            return true;
        }
        /* **********************************************************************************
         * Update user
         * ********************************************************************************** */
        public async Task<string> UpdateUser(string username, UserDto request) {
            var user = await GetUserByUsername(username);

            // ne postoji user
            if (user == null) {
                return "User not found";
            }

            if(user.UserName != request.Username) {
                if(await UserExistsByUsername(request.Username)) return "Username already in use";
            }

            if(user.Email != request.Email) {
                if(await UserExistsByEmail(request.Email)) return "Email address already in use";
            }

            user.UserName = request.Username;
            user.Email = request.Email;
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.CompanyRoleId = companyRolesRepository.GetCompanyRoleByNameAsync(request.CompanyRoleName).Result.Id;
            user.ProfilePhoto = request.ProfilePhoto;
            user.Address = request.Address;
            user.ContactPhone = request.ContactPhone;
            user.Status = request.Status;
            user.IsVerified = request.IsVerified;
            user.PreferedLanguage = request.PreferedLanguage;
            user.CreatedAt = user.CreatedAt;
            user.UpdatedAt = DateTime.Now;
            user.IsActive = request.isActive;

            await userManager.UpdateAsync(user);

            return "OK";
        }

        public async Task<string> UpdateUserPreferedTheme(string username, string theme)
        {
            var user = await GetUserByUsername(username);

            // ne postoji user
            if (user == null)
            {
                return "User not found";
            }
            
            user.PreferedTheme = theme;

            await userManager.UpdateAsync(user);

            return "OK";
        }

        /* **********************************************************************************
         * UsernameToId
         * ********************************************************************************** */
        public async Task<int> UsernameToId(string username) {
            var user = await dataContext.Users.FirstOrDefaultAsync(user => user.UserName == username);
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
            return user.UserName;
        }

        // Implementacija metode za proveru da li korisnik postoji u bazi preko korisnickog imena
        public async Task<bool> UserExistsByUsername(string username)
        {
            return await dataContext.Users.AnyAsync(x => x.UserName == username);
        }

        // Implementacija metode za proveru da li korisnik postoji u bazi preko email-a
        public async Task<bool> UserExistsByEmail(string email)
        {
            return await dataContext.Users.AnyAsync(x => x.Email == email);
        }

        public async Task<IEnumerable<User>> GetUsersFromIDarray(string[] arr) {
            return dataContext.Users.Where(u => arr.Contains(u.UserName));
        }

        /* ****************************************************************************************************************************** */
        /* ****************************************************************************************************************************** */
        /* ********************************************** PRIVATE HELPER METHODS ******************************************************** */
        /* ****************************************************************************************************************************** */
        /* ****************************************************************************************************************************** */

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

        public async Task UpdateUserProfilePhoto(string username, string photoURL)
        {
            var user = await dataContext.Users.SingleOrDefaultAsync(user => user.UserName == username);

            if(user != null)
            {
                user.ProfilePhoto = photoURL;
                await dataContext.SaveChangesAsync();
            }
        }

        public async Task<(IEnumerable<User> users, int numberOfRecords)> GetPaginationAllUsersAsync(Criteria criteria)
        {
            var users = dataContext.Users
                .Join(dataContext.CRoles,
                    u => u.CompanyRoleId,
                    cr => cr.Id,
                    (u, cr) => new { User = u, CompanyRole = cr });

            if (criteria.Filters.Count > 0)
            {
                var users2 = users;
                var users3 = users;
                foreach (var filter in criteria.Filters)
                {
                    users2 = users;
                    users3 = users.Where(u => u.User.UserName==null);
                    foreach (var fieldFilter in filter.Fieldfilters)
                    {
                        if (fieldFilter.Value.GetType() == typeof(string))
                        {
                            if (fieldFilter.MatchMode == "startsWith")
                            {
                                if (filter.Field == "username")
                                {
                                    users2 = users.Where(u => u.User.UserName.StartsWith((string)fieldFilter.Value));
                                }
                                else
                                {
                                    users2 = users.Where(u => u.User.Email.StartsWith((string)fieldFilter.Value));
                                }
                            }
                            else
                            {
                                if (fieldFilter.MatchMode == "contains")
                                {
                                    if (filter.Field == "username")
                                    {
                                        users2 = users.Where(u => u.User.UserName.Contains((string)fieldFilter.Value));
                                    }
                                    else
                                    {
                                        users2 = users.Where(u => u.User.Email.Contains((string)fieldFilter.Value));
                                    }
                                }
                                else
                                {
                                    if (fieldFilter.MatchMode == "notContains")
                                    {
                                        if (filter.Field == "username")
                                        {
                                            users2 = users.Where(u => !u.User.UserName.Contains((string)fieldFilter.Value));
                                        }
                                        else
                                        {
                                            users2 = users.Where(u => !u.User.Email.Contains((string)fieldFilter.Value));
                                        }
                                    }
                                    else
                                    {
                                        if (fieldFilter.MatchMode == "endsWith")
                                        {
                                            if (filter.Field == "username")
                                            {
                                                users2 = users.Where(u => u.User.UserName.EndsWith((string)fieldFilter.Value));
                                            }
                                            else
                                            {
                                                users2 = users.Where(u => u.User.Email.EndsWith((string)fieldFilter.Value));
                                            }
                                        }
                                        else
                                        {
                                            if (fieldFilter.MatchMode == "equals")
                                            {
                                                if (filter.Field == "username")
                                                {
                                                    users2 = users.Where(u => u.User.UserName.Equals((string)fieldFilter.Value));
                                                }
                                                else
                                                {
                                                    users2 = users.Where(u => u.User.Email.Equals((string)fieldFilter.Value));
                                                }
                                            }
                                            else
                                            {
                                                if (fieldFilter.MatchMode == "notEquals")
                                                {
                                                    if (filter.Field == "username")
                                                    {
                                                        users2 = users.Where(u => !u.User.UserName.Equals((string)fieldFilter.Value));
                                                    }
                                                    else
                                                    {
                                                        users2 = users.Where(u => !u.User.Email.Equals((string)fieldFilter.Value));
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            if (fieldFilter.Value.GetType() == typeof(DateTime))
                            {
                                if (fieldFilter.MatchMode == "dateIs")
                                {
                                    if (filter.Field == "createdAt")
                                    {
                                        users2 = users.Where(u => u.User.CreatedAt.Date.Equals(((DateTime)fieldFilter.Value).AddDays(1).Date));
                                    }
                                    else
                                    {
                                        users2 = users.Where(u => u.User.UpdatedAt.Date.Equals(((DateTime)fieldFilter.Value).AddDays(1).Date));
                                    }
                                }
                                else
                                {
                                    if (fieldFilter.MatchMode == "dateIsNot")
                                    {
                                        if (filter.Field == "createdAt")
                                        {
                                            users2 = users.Where(u => !u.User.CreatedAt.Date.Equals(((DateTime)fieldFilter.Value).AddDays(1).Date));
                                        }
                                        else
                                        {
                                            users2 = users.Where(u => !u.User.UpdatedAt.Date.Equals(((DateTime)fieldFilter.Value).AddDays(1).Date));
                                        }
                                    }
                                    else
                                    {
                                        if (fieldFilter.MatchMode == "dateAfter")
                                        {
                                            if (filter.Field == "createdAt")
                                            {
                                                users2 = users.Where(u => u.User.CreatedAt.Date > (((DateTime)fieldFilter.Value).AddDays(1).Date));
                                            }
                                            else
                                            {
                                                users2 = users.Where(u => u.User.UpdatedAt.Date > (((DateTime)fieldFilter.Value).AddDays(1).Date));
                                            }
                                        }
                                        else
                                        {
                                            if (fieldFilter.MatchMode == "dateBefore")
                                            {
                                                if (filter.Field == "createdAt")
                                                {
                                                    users2 = users.Where(u => u.User.CreatedAt.Date < (((DateTime)fieldFilter.Value).AddDays(1).Date));
                                                }
                                                else
                                                {
                                                    users2 = users.Where(u => u.User.UpdatedAt.Date < (((DateTime)fieldFilter.Value).AddDays(1).Date));
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else
                            {
                                if(fieldFilter.Value.GetType() == typeof(JArray))
                                {
                                    users2 = users.Where(u => (((JArray)fieldFilter.Value).ToObject<List<string>>()).Contains(u.CompanyRole.Name));
                                }
                                else
                                {
                                    users2 = users.Where(u => u.User.IsActive == (bool)fieldFilter.Value);  
                                }  
                            }
                        }
                        if(fieldFilter.Operator == "or")
                        {
                            users3 = users3.Union(users2);
                        }
                        else
                        {
                            users = users2;
                            users3 = users;
                        } 
                    }
                    users = users3;
                }
            }
            int numberOfRecords = users.Count();
            if (criteria.MultiSortMeta.Count > 0)
            {
                MultiSortMeta firstOrder = criteria.MultiSortMeta[0];
                criteria.MultiSortMeta.RemoveAt(0);
                var orderdUsers = users.OrderBy(u => u.User.UserName);

                if (firstOrder.Order == 1)
                {
                    if (firstOrder.Field == "username")
                    {
                        orderdUsers = users.OrderBy(u => u.User.UserName);
                    }
                    else
                    {
                        if (firstOrder.Field == "email")
                        {
                            orderdUsers = users.OrderBy(u => u.User.Email);
                        }
                        else
                        {
                            if (firstOrder.Field == "companyRoleName")
                            {
                                orderdUsers = users.OrderBy(u => u.CompanyRole.Name);
                            }
                            else
                            {
                                if (firstOrder.Field == "createdAt")
                                {
                                    orderdUsers = users.OrderBy(u => u.User.CreatedAt);
                                }
                                else
                                {
                                    orderdUsers = users.OrderBy(u => u.User.UpdatedAt);
                                }
                            }
                        }
                    }
                }
                else
                {
                    if (firstOrder.Field == "username")
                    {
                        orderdUsers = users.OrderByDescending(u => u.User.UserName);
                    }
                    else
                    {
                        if (firstOrder.Field == "email")
                        {
                            orderdUsers = users.OrderByDescending(u => u.User.Email);
                        }
                        else
                        {
                            if (firstOrder.Field == "companyRoleName")
                            {
                                orderdUsers = users.OrderByDescending(u => u.CompanyRole.Name);
                            }
                            else
                            {
                                if (firstOrder.Field == "createdAt")
                                {
                                    orderdUsers = users.OrderByDescending(u => u.User.CreatedAt);
                                }
                                else
                                {
                                    orderdUsers = users.OrderByDescending(u => u.User.UpdatedAt);
                                }
                            }
                        }
                    }
                }
                foreach (var order in criteria.MultiSortMeta)
                {
                    if (order.Order == 1)
                    {
                        if (order.Field == "username")
                        {
                            orderdUsers = orderdUsers.ThenBy(u => u.User.UserName);
                        }
                        else
                        {
                            if (order.Field == "email")
                            {
                                orderdUsers = orderdUsers.ThenBy(u => u.User.Email);
                            }
                            else
                            {
                                if (order.Field == "companyRoleName")
                                {
                                    orderdUsers = orderdUsers.ThenBy(u => u.CompanyRole.Name);
                                }
                                else
                                {
                                    if (order.Field == "createdAt")
                                    {
                                        orderdUsers = orderdUsers.ThenBy(u => u.User.CreatedAt);
                                    }
                                    else
                                    {
                                        orderdUsers = orderdUsers.ThenBy(u => u.User.UpdatedAt);
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        if (order.Field == "username")
                        {
                            orderdUsers = orderdUsers.ThenByDescending(u => u.User.UserName);
                        }
                        else
                        {
                            if (order.Field == "email")
                            {
                                orderdUsers = orderdUsers.ThenByDescending(u => u.User.Email);
                            }
                            else
                            {
                                if (order.Field == "companyRoleName")
                                {
                                    orderdUsers = orderdUsers.ThenByDescending(u => u.CompanyRole.Name);
                                }
                                else
                                {
                                    if (order.Field == "createdAt")
                                    {
                                        orderdUsers = orderdUsers.ThenByDescending(u => u.User.CreatedAt);
                                    }
                                    else
                                    {
                                        orderdUsers = orderdUsers.ThenByDescending(u => u.User.UpdatedAt);
                                    }
                                }
                            }
                        }
                    }
                }
                return (await orderdUsers.Select(u => u.User).Skip(criteria.First).Take(criteria.Rows).ToArrayAsync(), numberOfRecords);
            }

            return (await users.Select(u => u.User).Skip(criteria.First).Take(criteria.Rows).ToArrayAsync(),numberOfRecords);
        }
    }
}
