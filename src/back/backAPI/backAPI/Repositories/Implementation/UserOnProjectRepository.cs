using backAPI.Data;
using backAPI.DTO;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation
{
    public class UserOnProjectRepository : IUserOnProjectRepository
    {
        private readonly DataContext dataContext;
        private readonly IUsersRepository usersRepository;
        private readonly IProjectsRepository projectsRepository;

        public UserOnProjectRepository(DataContext dataContext, IUsersRepository usersRepository, IProjectsRepository projectsRepository)
        {
            this.dataContext = dataContext;
            this.usersRepository = usersRepository;
            this.projectsRepository = projectsRepository;
        }
        public async Task<bool> AddUserToProjectAsync(string projectName, UserOnProjectDto userDto)
        {
            var idProject = await projectsRepository.GetProjectByName(projectName);
            var idUser = await usersRepository.GetUserByUsername(userDto.Username);

            if (idProject == null || idUser == null)
            {
                return false;
            }

            //Provera da li korisnik vec postoji na projektu
            var existingEntry = await dataContext.UsersOnProjects
                .FirstOrDefaultAsync(up => up.UserId == idUser.Id &&  up.ProjectId == idProject.Id);
            if (existingEntry != null) {
                return false;
            }

            var newUserOnProject = new UsersOnProject
            {
                UserId = idUser.Id,
                ProjectId = idProject.Id,
            };

            dataContext.UsersOnProjects.Add(newUserOnProject);
            await dataContext.SaveChangesAsync();

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
                    (up, p) => new { User = up.User, Project = p })
                .Where(x => x.Project.Name == projectName)
                .Select(x => x.User)
                .ToListAsync();
        }

        public Task<bool> RemoveUserFromProjectAsync(string projectName, UserOnProjectDto userDto)
        {
            throw new NotImplementedException();
        }
    }
}
