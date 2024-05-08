using backAPI.Data;
using backAPI.DTO;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using backAPI.Repositories.Interface.Projects;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation.Projects
{
    public class UserOnProjectRepository : IUserOnProjectRepository
    {
        private readonly DataContext dataContext;
        private readonly IUsersRepository usersRepository;
        private readonly IProjectsRepository projectsRepository;
        private readonly ILogsRepository logsRepository;

        public UserOnProjectRepository(
            DataContext dataContext, 
            IUsersRepository usersRepository,
            IProjectsRepository projectsRepository,
            ILogsRepository logsRepository
        ) {
            this.dataContext = dataContext;
            this.usersRepository = usersRepository;
            this.projectsRepository = projectsRepository;
            this.logsRepository = logsRepository;
        }

        public async Task<bool> AddUserToProjectAsync(string projectName, string username, string color)
        {
            var idProject = await projectsRepository.GetProjectByName(projectName);
            var idUser = await usersRepository.GetUserByUsername(username);

            if (idProject == null || idUser == null)
            {
                return false;
            }

            //Provera da li korisnik vec postoji na projektu
            var existingEntry = await dataContext.UsersOnProjects
                .FirstOrDefaultAsync(up => up.UserId == idUser.Id && up.ProjectId == idProject.Id);
            if (existingEntry != null)
            {
                return false;
            }

            var newUserOnProject = new UsersOnProject
            {
                UserId = idUser.Id,
                ProjectId = idProject.Id,
                UserColor = color
            };

            dataContext.UsersOnProjects.Add(newUserOnProject);
            await dataContext.SaveChangesAsync();

            await logsRepository.AddLogToDatabase(new Log {
                ProjectId = idProject.Id,
                Message = "🎉 User joined the project",
                DateCreated = DateTime.Now
            });

            return true;
        }

        public async Task<IEnumerable<User>> GetUsersOnProjectAsync(string projectName)
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
                .Where(x => x.Project.Name == projectName)
                .Select(x => x.User)
                .ToListAsync();
        }

        public async Task<User> GetUserOnProjectAsync(string projectname, string username)
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
                .Where(x => x.User.UserName == username && x.Project.Name == projectname)
                .Select(x => x.User)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Project>> GetProjectsByUser(string username)
        {
            var user = await usersRepository.GetUserByUsername(username);
            if (user == null)
            {
                return Enumerable.Empty<Project>();
            }

            return await dataContext.Users
                .Where(u => u.Id == user.Id)
                .Join(dataContext.UsersOnProjects,
                    u => u.Id,
                    up => up.UserId,
                    (u, up) => new { User = u, ProjectId = up})
                .Join(dataContext.Projects,
                    up => up.ProjectId.ProjectId,
                    p => p.Id,
                    (up, p) => new {Projects = p})
                .Select(p => p.Projects)
                .ToListAsync();
        }

        public async Task<bool> RemoveUserFromProjectAsync(string projectName, string username)
        {
            var project = await projectsRepository.GetProjectByName(projectName);
            var user = await usersRepository.GetUserByUsername(username);

            if (user == null || project == null)
            {
                return false;
            }

            var userOnProject = await dataContext.UsersOnProjects.FirstOrDefaultAsync(up => up.UserId == user.Id && up.ProjectId == project.Id);
            if (userOnProject == null)
            {
                return false;
            }

            dataContext.UsersOnProjects.Remove(userOnProject);
            await dataContext.SaveChangesAsync();

            await logsRepository.AddLogToDatabase(new Log {
                ProjectId = project.Id,
                Message = "⛔ User removed from the project",
                DateCreated = DateTime.Now
            });

            return true;
        }

        public async Task<IEnumerable<User>> GetUsersOnProjectThatCanManageProjectAsync(string projectName)
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
                .Join(dataContext.CRoles,
                    u => u.User.CompanyRoleId,
                    cr => cr.Id,
                    (u, cr) => new { u.User, u.Project, CompanyRole = cr })
                .Where(x => x.CompanyRole.CanManageProjects && x.Project.Name == projectName)
                .Select(x => x.User)
                .ToListAsync();
        }
    }
}
