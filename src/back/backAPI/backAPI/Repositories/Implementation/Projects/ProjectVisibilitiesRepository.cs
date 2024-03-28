using backAPI.Data;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface.Projects;
using Microsoft.EntityFrameworkCore;
using System.Xml.Linq;

namespace backAPI.Repositories.Implementation.Projects
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

        public async Task<ProjectVisibility> GetProjectVisibilityByNameAsync(string name)
        {
            return await dataContext.ProjectVisibilities.FirstOrDefaultAsync(x => x.Name == name);
        }

        public async Task<ProjectVisibility> GetProjectVisibilityByIdAsync(int id)
        {
            return await dataContext.ProjectVisibilities.FirstOrDefaultAsync(x => x.Id == id);
        }
    }
}
