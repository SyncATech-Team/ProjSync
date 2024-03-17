using backAPI.Data;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation
{
    public class ProjectTypesRepository : IProjectTypesRepository
    {
        private readonly DataContext dataContext;

        public ProjectTypesRepository(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }
        public async Task<IEnumerable<ProjectType>> GetProjectTypesAsync()
        {
            return await dataContext.ProjectTypes.ToListAsync();
        }

        public async Task<ProjectType> GetProjectTypeByNameAsync(string name) {
            return await dataContext.ProjectTypes.FirstOrDefaultAsync(x => x.Name == name);
        }

        public async Task<ProjectType> GetProjectTypeById(int id) {
            return await dataContext.ProjectTypes.FirstOrDefaultAsync(x => x.Id == id);
        }
    }
}
