using backAPI.Data;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation {
    public class UsersRepository : IUsersRepository {

        private readonly DataContext dataContext;

        public UsersRepository(DataContext dataContext) { 
            this.dataContext = dataContext;
        }

        public async Task<User> CreateNewUserAsync(User user) {
            
            await dataContext.Users.AddAsync(user);
            await dataContext.SaveChangesAsync();

            return user;
        }

        public async Task<bool> CheckUsernameExistance(string username) {
            return await dataContext.Users.AnyAsync(user => user.Username.ToLower() == username.ToLower());
        }

        Task<User> IUsersRepository.GetUserIfExists(string email) {
            return dataContext.Users.SingleOrDefaultAsync(user => user.UserEmail == email);
        }

        async Task<bool> IUsersRepository.CheckEmailExistance(string email) {
            return await dataContext.Users.AnyAsync(user => user.UserEmail.ToLower() == email.ToLower());
        }
    }
}
