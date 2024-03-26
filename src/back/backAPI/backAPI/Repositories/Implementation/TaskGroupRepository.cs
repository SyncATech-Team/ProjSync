using backAPI.Data;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation {
    public class TaskGroupRepository : ITaskGroupRepository {

        private readonly DataContext dataContext;

        /* *****************************************************************************
         * Konstruktor
         * ***************************************************************************** */
        public TaskGroupRepository(DataContext dataContext) {
            this.dataContext = dataContext;
        }

        /* *****************************************************************************
         * Kreiranje grupe na projektu
         * ***************************************************************************** */
        public async Task<TaskGroup> CreateGroupAsync(TaskGroup group) {
            await dataContext.TaskGroups.AddAsync(group);
            await dataContext.SaveChangesAsync();

            return group;
        }
        /* *****************************************************************************
         * Brisanje grupe
         * ***************************************************************************** */
        public async Task<bool> DeleteGroupFromProjectAsync(int groupId) {
            var group = dataContext.TaskGroups.FirstOrDefaultAsync(group => group.Id == groupId);
            
            if(group == null) {
                return false;
            }
            var groupForReal = group.Result;
            dataContext.TaskGroups.Remove(groupForReal);
            await dataContext.SaveChangesAsync();
            return true;
        }
        /* *****************************************************************************
         * Dovlacenje svih grupa za odredjeni projekat
         * ***************************************************************************** */
        public async Task<IEnumerable<TaskGroup>> GetGroupsAsync(int projectId) {
            return await dataContext.TaskGroups.ToListAsync();
        }







        /* *****************************************************************************
         * Provera da li postoji grupa sa istim imenom na datom projektu
         * ***************************************************************************** */
        public bool GroupNameExistsWithinTheSameProject(int projectId, string name) {
            var x = dataContext.TaskGroups.Where(group => group.ProjectId == projectId && group.Name == name).FirstOrDefault();

            if(x == null) { return false; }

            return true;
        }
    }
}
