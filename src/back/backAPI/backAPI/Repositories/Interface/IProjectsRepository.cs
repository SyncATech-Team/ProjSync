using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface
{
    public interface IProjectsRepository
    {
        Task<IEnumerable<Project>> GetProjectsAsync();

        Task<bool> ProjectExistsByName(string name);

        Task<bool> ProjectExistsByKey(string key);

        Task<Project> CreateProject(Project project);
    }
}
