using backAPI.DTO;
using backAPI.Entities.Domain;
using backAPI.Other.Helpers;

namespace backAPI.Repositories.Interface.Projects
{
    public interface IUserOnProjectRepository
    {
        Task<IEnumerable<User>> GetUsersOnProjectAsync(string projectName);
        Task<bool> AddUserToProjectAsync(string projectName, string username, string color);
        Task<bool> RemoveUserFromProjectAsync(string projectName, string username);
        Task<IEnumerable<Project>> GetProjectsByUser(string username);
        Task<(IEnumerable<User> users, int numberOfRecords)> GetPaginationUsersOnProjectAsync(string projectName,Criteria criteria);
    }
}
