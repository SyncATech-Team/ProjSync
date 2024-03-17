﻿using backAPI.DTO;
using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface
{
    public interface IProjectsRepository
    {
        Task<IEnumerable<Project>> GetProjectsAsync();

        Task<bool> ProjectExistsByName(string name);

        Task<bool> ProjectExistsByKey(string key);

        Task<Project> CreateProject(ProjectDto request);

        Task<bool> DeleteProject(string name);

        Task<Project> GetProjectByName(string name);

        Task<bool> UpdateProject(string name,ProjectDto request);
    }
}
