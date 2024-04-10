using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface.Projects
{
    public interface IProjectVisibilitiesRepository
    {
        Task<IEnumerable<ProjectVisibility>> GetProjectVisibilitiesAsync();
        Task<ProjectVisibility> GetProjectVisibilityByNameAsync(string name);
        Task<ProjectVisibility> GetProjectVisibilityByIdAsync(int id);
    }
}
