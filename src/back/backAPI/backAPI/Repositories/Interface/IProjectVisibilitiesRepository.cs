using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface
{
    public interface IProjectVisibilitiesRepository
    {
        Task<IEnumerable<ProjectVisibility>> GetProjectVisibilitiesAsync();
    }
}
