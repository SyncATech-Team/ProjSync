using backAPI.DTO;
using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface
{
    public interface IUserOnProjectRepository
    {
        Task<IEnumerable<User>> GetUsersOnProjectAsync(string projectName);
        Task<bool> AddUserToProjectAsync(string projectName, string username);
        Task<bool> RemoveUserFromProjectAsync(string projectName, string username);
    }
}
