using backAPI.Data;
using backAPI.DTO.Projects;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using backAPI.Repositories.Interface.Projects;
using backAPI.Repositories.Interface.Issues;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation.Projects
{
    public class ProjectsRepository : IProjectsRepository
    {
        private readonly DataContext dataContext;
        private readonly IUsersRepository usersRepository;
        private readonly IProjectTypesRepository projectTypesRepository;
        private readonly IProjectVisibilitiesRepository projectVisibilitiesRepository;
        private readonly IIssueGroupRepository taskGroupRepository;

        public ProjectsRepository(DataContext dataContext, IUsersRepository usersRepository,
            IProjectTypesRepository projectTypesRepository, IProjectVisibilitiesRepository projectVisibilitiesRepository,
            IIssueGroupRepository taskGroupRepository)
        {
            this.dataContext = dataContext;
            this.usersRepository = usersRepository;
            this.projectTypesRepository = projectTypesRepository;
            this.projectVisibilitiesRepository = projectVisibilitiesRepository;
            this.taskGroupRepository = taskGroupRepository;
        }

        public async Task<Project> CreateProject(ProjectDto request)
        {
            if (request.VisibilityName == "" || request.Name == "" || request.Key == "" || request.TypeName == "" || request.OwnerUsername == "")
            {
                Console.WriteLine("USOOO U NULLL");
                return null;
            }

            var user = await usersRepository.GetUserByUsername(request.OwnerUsername);
            var type = await projectTypesRepository.GetProjectTypeByNameAsync(request.TypeName);
            var visibility = await projectVisibilitiesRepository.GetProjectVisibilityByNameAsync(request.VisibilityName);
            
            var project = new Project
            {
                Name = request.Name,
                Key = request.Key,
                Description = request.Description,
                CreationDate = request.CreationDate,
                DueDate = request.DueDate,
                OwnerId = user.Id,
                ParentId = request.ParentProjectName == null ? null : GetProjectByName(request.ParentProjectName).Result.Id,
                Budget = request.Budget,
                VisibilityId = visibility.Id,
                TypeId = type.Id
            };

            await dataContext.Projects.AddAsync(project);
            await dataContext.SaveChangesAsync();
            Console.WriteLine("Dodat projekat");

            var addedProject = await GetProjectByName(request.Name);
            var newUserOnProject = new UsersOnProject
            {
                UserId = user.Id,
                ProjectId = addedProject.Id,
            };
            await dataContext.UsersOnProjects.AddAsync(newUserOnProject);
            await dataContext.SaveChangesAsync();
            Console.WriteLine("Dodat user");

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


        public async Task<Project> GetProjectById(int id)
        {
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

            if (project == null)
            {
                return false;
            }

            project.Name = request.Name;
            project.Description = request.Description;
            project.Key = request.Key;
            project.TypeId = projectTypesRepository.GetProjectTypeByNameAsync(request.TypeName).Result.Id;
            project.OwnerId = usersRepository.GetUserByUsername(request.OwnerUsername).Result.Id;
            project.IconPath = request.Icon;
            project.ParentId = request.ParentProjectName == null ? null : GetProjectByName(request.ParentProjectName).Result.Id;
            project.CreationDate = request.CreationDate;
            project.DueDate = request.DueDate;
            project.Budget = request.Budget;
            project.VisibilityId = projectVisibilitiesRepository.GetProjectVisibilityByNameAsync(request.VisibilityName).Result.Id;

            await dataContext.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<int>> GetTaskGroupIds(int projectId)
        {
            var groups = await taskGroupRepository.GetGroupsAsync(projectId);
            List<int> groupids = new List<int>();
            foreach (var group in groups)
            {
                groupids.Add(group.Id);
            }
            return groupids;
        }

        public async Task<IEnumerable<Project>> GetProjectsForUserAsync(string username)
        {
            return await dataContext.Users
                .Join(dataContext.UsersOnProjects,
                    u => u.Id,
                    up => up.UserId,
                    (u, up) => new { User = u, UserProject = up })
                .Join(dataContext.Projects,
                    up => up.UserProject.ProjectId,
                    p => p.Id,
                    (up, p) => new { up.User, Project = p })
                .Where(x => x.User.UserName == username)
                .Select(x => x.Project)
                .ToListAsync();
        }

        public async Task<bool> TransferProject(string name, string transferToUser)
        {
            var project = await GetProjectByName(name);

            if (project == null)
            {
                return false;
            }

            project.OwnerId = usersRepository.GetUserByUsername(transferToUser).Result.Id;

            await dataContext.SaveChangesAsync();

            return true;
        }
    }
}
