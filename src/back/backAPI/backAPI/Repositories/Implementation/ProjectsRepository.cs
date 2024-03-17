using backAPI.Data;
using backAPI.DTO;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using System.Xml.Linq;

namespace backAPI.Repositories.Implementation
{
    public class ProjectsRepository : IProjectsRepository
    {
        private readonly DataContext dataContext;
        private readonly IUsersRepository usersRepository;
        private readonly IProjectTypesRepository projectTypesRepository;
        private readonly IProjectVisibilitiesRepository projectVisibilitiesRepository;

        public ProjectsRepository(DataContext dataContext, IUsersRepository usersRepository, 
            IProjectTypesRepository projectTypesRepository, IProjectVisibilitiesRepository projectVisibilitiesRepository)
        {
            this.dataContext = dataContext;
            this.usersRepository = usersRepository;
            this.projectTypesRepository = projectTypesRepository;
            this.projectVisibilitiesRepository = projectVisibilitiesRepository;
        }

        public async Task<Project> CreateProject(ProjectDto request)
        {
            var user = await usersRepository.GetUserByUsername(request.OwnerUsername);
            var type = await projectTypesRepository.GetProjectTypeByNameAsync(request.TypeName);
            var visibility = await projectVisibilitiesRepository.GetProjectVisibilityByNameAsync(request.VisibilityName);
            var parent = await GetProjectByName(request.ParentProjectName);
            var project = new Project {
                Name = request.Name,
                Key = request.Key,
                Description = request.Description,
                CreationDate = request.CreationDate,
                DueDate = request.DueDate,
                OwnerId = user.Id,
                ParentId = parent.Id,  // to do?
                Budget = request.Budget,
                VisibilityId = visibility.Id,
                TypeId = type.Id
            };

            await dataContext.Projects.AddAsync(project);
            await dataContext.SaveChangesAsync();

            return project;
        }

        public async Task<bool> DeleteProject(string name)
        {
            var project = await GetProjectByName(name);
            
            if (project == null)
            {
                return false;
            }

            dataContext.Projects.Remove(project);
            await dataContext.SaveChangesAsync(true);
            
            return true;
        }

        public async Task<Project> GetProjectByName(string name)
        {
            return await dataContext.Projects.SingleOrDefaultAsync(p => p.Name == name);
        }

        public async Task<IEnumerable<Project>> GetProjectsAsync()
        {
            return await dataContext.Projects.ToListAsync();
        }

        public async Task<Project> GetProjectByName(string name) {
            return await dataContext.Projects.FirstOrDefaultAsync(x => x.Name == name);
        }

        public async Task<Project> GetProjectById(int id) {
            return await dataContext.Projects.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<bool> ProjectExistsByKey(string key)
        {
            return await dataContext.Projects.AnyAsync(p => p.Key == key);
        }

        public async Task<bool> ProjectExistsByName(string name)
        {
            return await dataContext.Projects.AnyAsync(p => p.Name == name);
        }

        public async Task<bool> UpdateProject(string name, ProjectDto request)
        {
            var project = await GetProjectByName(name);

            if(project == null)
            {
                return false;
            }

            project.Name = request.Name;
            project.Description = request.Description;
            project.Key = request.Key;
            project.TypeId = projectTypesRepository.GetProjectTypeByNameAsync(request.TypeName).Result.Id;
            project.OwnerId = usersRepository.GetUserByUsername(request.OwnerUsername).Result.Id;
            project.ParentId = request.ParentId;
            project.CreationDate = request.CreationDate;
            project.DueDate = request.DueDate;
            project.Budget = request.Budget;
            project.VisibilityId = projectVisibilitiesRepository.GetProjectVisibilityByNameAsync(request.VisibilityName).Result.Id;

            await dataContext.SaveChangesAsync();

            return true;
        }
    }
}
