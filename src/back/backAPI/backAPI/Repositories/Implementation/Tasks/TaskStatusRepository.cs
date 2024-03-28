using backAPI.Data;
using backAPI.Repositories.Interface.Tasks;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation.Tasks
{
    public class TaskStatusRepository : ITaskStatusRepository
    {

        private readonly DataContext _dataContext;

        public TaskStatusRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<Entities.Domain.TaskStatus> GetTaskTypeById(int id)
        {
            return await _dataContext.TaskStatuses.Where(type => type.Id == id).FirstAsync();
        }

        public async Task<Entities.Domain.TaskStatus> GetTaskTypeByName(string name)
        {
            return await _dataContext.TaskStatuses.Where(type => type.Name == name).FirstAsync();
        }
    }
}
