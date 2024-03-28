using backAPI.DTO;
using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface.Projects
{
    public interface IUserOnProjectRepository
    {
        Task<IEnumerable<User>> GetUsersOnProjectAsync(string projectName);
        Task<bool> AddUserToProjectAsync(string projectName, UserOnProjectDto userDto);
        Task<bool> RemoveUserFromProjectAsync(string projectName, UserOnProjectDto userDto);
    }
}
