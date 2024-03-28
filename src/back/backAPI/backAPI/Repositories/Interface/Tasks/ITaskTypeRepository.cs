using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface.Tasks
{
    public interface ITaskTypeRepository
    {

        Task<TaskType> GetTaskTypeByName(string name);
        Task<TaskType> GetTaskTypeById(int id);

    }
}
