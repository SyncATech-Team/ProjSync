using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface {
    public interface IUsersRepository {

        Task<User> CreateNewUserAsync(User user);
        Task<bool> CheckUserExistance(string username);
        Task<User> GetUserIfExists(string email);

    }
}
