using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface.Tasks
{
    public interface ITaskPriorityRepository
    {
        Task<TaskPriority> GetTaskPriorityByName(string name);
        Task<TaskPriority> GetTaskPriorityById(int id);
    }
}
