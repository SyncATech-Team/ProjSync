using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface {
    public interface IUsersRepository {

        Task<User> CreateNewUserAsync(User user);
        Task<bool> CheckUsernameExistance(string username);
        Task<bool> CheckEmailExistance(string email);
        Task<User> GetUserIfExists(string email);
        Task<bool> DeleteUser(int id);

    }
}
