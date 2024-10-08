﻿using backAPI.DTO;
using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface.Projects
{
    public interface IUserOnProjectRepository
    {
        Task<IEnumerable<User>> GetUsersOnProjectAsync(string projectName);
        Task<User> GetUserOnProjectAsync(string projectName, string username);
        Task<bool> AddUserToProjectAsync(string projectName, string username, string color);
        Task<bool> RemoveUserFromProjectAsync(string projectName, string username);
        Task<IEnumerable<Project>> GetProjectsByUser(string username);
        Task<IEnumerable<User>> GetUsersOnProjectThatCanManageProjectAsync(string projectName);
    }
}
