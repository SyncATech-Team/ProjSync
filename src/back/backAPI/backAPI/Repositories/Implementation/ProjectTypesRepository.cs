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
    }
}
