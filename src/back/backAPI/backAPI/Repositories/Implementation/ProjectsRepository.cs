using backAPI.Data;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation
{
    public class ProjectsRepository : IProjectsRepository
    {
        private readonly DataContext dataContext;

        public ProjectsRepository(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        public async Task<Project> CreateProject(Project project)
        {
            await dataContext.Projects.AddAsync(project);
            await dataContext.SaveChangesAsync();

            return project;
        }

        public async Task<IEnumerable<Project>> GetProjectsAsync()
        {
            return await dataContext.Projects.ToListAsync();
        }

        public async Task<bool> ProjectExistsByKey(string key)
        {
            return await dataContext.Projects.AnyAsync(p => p.Key == key);
        }

        public async Task<bool> ProjectExistsByName(string name)
        {
            return await dataContext.Projects.AnyAsync(p => p.Name == name);
        }
    }
}
