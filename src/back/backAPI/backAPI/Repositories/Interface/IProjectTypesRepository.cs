using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface
{
    public interface IProjectTypesRepository
    {
        Task<IEnumerable<ProjectType>> GetProjectTypesAsync();
    }
}
