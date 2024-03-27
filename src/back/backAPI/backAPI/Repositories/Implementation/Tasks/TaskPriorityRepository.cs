using backAPI.Data;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface.Tasks;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation.Tasks
{
    public class TaskPriorityRepository : ITaskPriorityRepository
    {

        private readonly DataContext _dataContext;

        public TaskPriorityRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<TaskPriority> GetTaskPriorityById(int id)
        {
            return await _dataContext.TaskPriority.Where(x => x.Id == id).FirstAsync();
        }

        public async Task<TaskPriority> GetTaskPriorityByName(string name)
        {
            return await _dataContext.TaskPriority.Where(x => x.Name == name).FirstAsync();
        }
    }
}
