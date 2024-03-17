using backAPI.Data;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation
{
    public class ProjectVisibilitiesRepository : IProjectVisibilitiesRepository
    {
        private readonly DataContext dataContext;

        public ProjectVisibilitiesRepository(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        public async Task<IEnumerable<ProjectVisibility>> GetProjectVisibilitiesAsync()
        {
            return await dataContext.ProjectVisibilities.ToListAsync();
        }
    }
}
