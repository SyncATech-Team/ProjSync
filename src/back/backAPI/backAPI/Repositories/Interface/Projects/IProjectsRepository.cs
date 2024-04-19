using backAPI.DTO.Projects;
using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface.Projects
{
    public interface IProjectsRepository
    {
        Task<IEnumerable<Project>> GetProjectsAsync();

        Task<bool> ProjectExistsByName(string name);

        Task<bool> ProjectExistsByKey(string key);

        Task<Project> CreateProject(ProjectDto request);

        Task<bool> DeleteProject(string name);

        Task<Project> GetProjectByName(string name);

        Task<bool> UpdateProject(string name, ProjectDto request);

        Task<Project> GetProjectById(int id);

        Task<IEnumerable<int>> GetTaskGroupIds(int projectId);

        Task<IEnumerable<Project>> GetProjectsForUserAsync(string username);
        Task<(IEnumerable<Project> projects, int numberOfRecords)> GetPaginationProjectsForUserAsync(string username, int limit, int skip);
    }
}
