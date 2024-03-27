using backAPI.Data;
using backAPI.Repositories.Interface.Tasks;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation.Tasks
{
    public class TasksRepository : ITasksRepository
    {

        private readonly DataContext _dataContext;

        /* *****************************************************************************************
         * Konstruktor
         * ***************************************************************************************** */
        public TasksRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        /* *****************************************************************************************
        * Dohvati sve zadatke za odredjenu grupu
        * ***************************************************************************************** */
        public async Task<IEnumerable<Entities.Domain.Task>> GetAllTasksForGivenGroup(int groupId)
        {
            var tasks = await _dataContext.Tasks.Where(t => t.GroupId == groupId).ToListAsync();

            return tasks;
        }
        /* *****************************************************************************************
        * Kreiranje zadatka
        * ***************************************************************************************** */
        public async Task<Entities.Domain.Task> CreateTaskAsync(Entities.Domain.Task task)
        {
            var anyother = await _dataContext.Tasks.FirstOrDefaultAsync(t => t.GroupId == task.GroupId && t.Name == task.Name);
            if (anyother != null)
            {
                return null; // postoji task u istoj grupi sa istim imenom
            }

            await _dataContext.Tasks.AddAsync(task);
            await _dataContext.SaveChangesAsync();
            return task;
        }
    }
}
