using backAPI.DTO;
using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface
{
    public interface IProjectsRepository
    {
        Task<IEnumerable<Project>> GetProjectsAsync();

        Task<bool> ProjectExistsByName(string name);

        Task<bool> ProjectExistsByKey(string key);

        Task<Project> CreateProject(ProjectDto request);
        Task<Project> GetProjectByName(string name);
        Task<Project> GetProjectById(int id);
    }
}
