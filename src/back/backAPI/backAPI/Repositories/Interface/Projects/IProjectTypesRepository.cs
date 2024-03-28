using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface.Projects
{
    public interface IProjectTypesRepository
    {
        Task<IEnumerable<ProjectType>> GetProjectTypesAsync();
        Task<ProjectType> GetProjectTypeByNameAsync(string name);
        Task<ProjectType> GetProjectTypeById(int id);
    }
}
