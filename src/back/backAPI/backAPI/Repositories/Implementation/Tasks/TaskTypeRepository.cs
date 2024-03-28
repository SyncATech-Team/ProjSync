using backAPI.Data;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Xml.Linq;

namespace backAPI.Repositories.Implementation.Tasks
{
    public class TaskTypeRepository : ITaskTypeRepository
    {

        private readonly DataContext _dataContext;

        public TaskTypeRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<TaskType> GetTaskTypeById(int id)
        {
            return await _dataContext.TaskTypes.Where(type => type.Id == id).FirstAsync();
        }

        public async Task<TaskType> GetTaskTypeByName(string name)
        {
            return await _dataContext.TaskTypes.Where(type => type.Name == name).FirstAsync();
        }
    }
}
