using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface.Issues
{
    public interface IIssuePriorityRepository
    {
        Task<IssuePriority> GetTaskPriorityByName(string name);
        Task<IssuePriority> GetTaskPriorityById(int id);
        Task<List<IssuePriority>> GetAllIssuePrioritys();
    }
}
