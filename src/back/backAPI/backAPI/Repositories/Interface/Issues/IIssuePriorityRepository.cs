using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface.Issues
{
    public interface IIssuePriorityRepository
    {
        Task<IssuePriority> GetIssuePriorityByName(string name);
        Task<IssuePriority> GetIssuePriorityById(int id);
        Task<List<IssuePriority>> GetAllIssuePrioritys();
    }
}
