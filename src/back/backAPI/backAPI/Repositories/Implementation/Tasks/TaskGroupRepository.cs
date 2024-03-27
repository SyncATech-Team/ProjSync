using backAPI.Data;
using backAPI.DTO.Tasks;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface.Tasks;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation.Tasks
{
    public class TaskGroupRepository : ITaskGroupRepository
    {

        private readonly DataContext dataContext;

        /* *****************************************************************************
         * Konstruktor
         * ***************************************************************************** */
        public TaskGroupRepository(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }
        /* *****************************************************************************
         * Dovlacenje svih grupa za odredjeni projekat
         * ***************************************************************************** */
        public async Task<IEnumerable<TaskGroup>> GetGroupsAsync(int projectId) {
            return await dataContext.TaskGroups.ToListAsync();
        }
        /* *****************************************************************************
         * Kreiranje grupe na projektu
         * ***************************************************************************** */
        public async Task<TaskGroup> CreateGroupAsync(TaskGroup group)
        {
            await dataContext.TaskGroups.AddAsync(group);
            await dataContext.SaveChangesAsync();
            
            return group;
        }
        /* *****************************************************************************
         * Brisanje grupe
         * ***************************************************************************** */
        public async Task<bool> DeleteGroupFromProjectAsync(int groupId)
        {
            var group = dataContext.TaskGroups.FirstOrDefaultAsync(group => group.Id == groupId);

            if (group == null)
            {
                return false;
            }
            var groupForReal = group.Result;
            dataContext.TaskGroups.Remove(groupForReal);
            await dataContext.SaveChangesAsync();
            return true;
        }


        public async Task<TGroupResponse> GetGroupForNameInProject(int projectId, int groupId) {
            var result = await dataContext.TaskGroups.FirstOrDefaultAsync(group => group.ProjectId == projectId && group.Id == groupId);
            return new TGroupResponse {
                Id = result.Id,
                Name = result.Name,
            };
        }



        /* *****************************************************************************
         * Provera da li postoji grupa sa istim imenom na datom projektu
         * ***************************************************************************** */
        public async Task<bool> GroupNameExistsWithinTheSameProject(int projectId, string name)
        {
            var x = await dataContext.TaskGroups.Where(group => group.ProjectId == projectId && group.Name == name).FirstOrDefaultAsync();

            if (x == null) { return false; }

            return true;
        }
    }
}
