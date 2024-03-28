namespace backAPI.Repositories.Interface.Tasks
{
    public interface ITaskStatusRepository
    {
        Task<Entities.Domain.TaskStatus> GetTaskTypeByName(string name);
        Task<Entities.Domain.TaskStatus> GetTaskTypeById(int id);
    }
}
