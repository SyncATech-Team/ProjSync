using backAPI.Data;
using backAPI.DTO;
using backAPI.Entities.Domain;
using backAPI.Other.Helpers;
using backAPI.Repositories.Interface;
using backAPI.Repositories.Interface.Projects;
using Microsoft.EntityFrameworkCore;
using Mysqlx.Crud;

namespace backAPI.Repositories.Implementation.Projects
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

            return true;
        }

        public async Task<(IEnumerable<User> users,int numberOfRecords)> GetPaginationUsersOnProjectAsync(string projectName,Criteria criteria)
        {
            var users = dataContext.Users
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
                    (u, cr) => new { u.User, u.Project, CompanyRole =  cr })
                .Where(x => x.Project.Name == projectName);
                
            int numberOfRecords = users.Count();

            if(criteria.MultiSortMeta.Count > 0)
            {
                MultiSortMeta firstOrder = criteria.MultiSortMeta[0];
                criteria.MultiSortMeta.RemoveAt(0);
                var orderdUsers = users.OrderBy(u => u.User.UserName);

                if (firstOrder.Order == 1)
                {
                    if (firstOrder.Field == "username")
                    {
                        orderdUsers = users.OrderBy(u => u.User.UserName);
                    }
                    else
                    {
                        if (firstOrder.Field == "email")
                        {
                            orderdUsers = users.OrderBy(u => u.User.Email);
                        }
                        else
                        {
                            if (firstOrder.Field == "firstName")
                            {
                                orderdUsers = users.OrderBy(u => u.User.FirstName);
                            }
                            else
                            {
                                if (firstOrder.Field == "lastName")
                                {
                                    orderdUsers = users.OrderBy(u => u.User.LastName);
                                }
                                else
                                {
                                    if (firstOrder.Field == "companyRoleName")
                                    {
                                        orderdUsers = users.OrderBy(u => u.CompanyRole.Name);
                                    }
                                    else
                                    {
                                        if (firstOrder.Field == "address")
                                        {
                                            orderdUsers = users.OrderBy(u => u.User.Address);
                                        }
                                        else
                                        {
                                            if (firstOrder.Field == "status")
                                            {
                                                orderdUsers = users.OrderBy(u => u.User.Status);
                                            }
                                            else
                                            {
                                                orderdUsers = users.OrderBy(u => u.User.ContactPhone);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else
                {
                    if (firstOrder.Field == "username")
                    {
                        orderdUsers = users.OrderByDescending(u => u.User.UserName);
                    }
                    else
                    {
                        if (firstOrder.Field == "email")
                        {
                            orderdUsers = users.OrderByDescending(u => u.User.Email);
                        }
                        else
                        {
                            if (firstOrder.Field == "firstName")
                            {
                                orderdUsers = users.OrderByDescending(u => u.User.FirstName);
                            }
                            else
                            {
                                if (firstOrder.Field == "lastName")
                                {
                                    orderdUsers = users.OrderByDescending(u => u.User.LastName);
                                }
                                else
                                {
                                    if (firstOrder.Field == "companyRoleName")
                                    {
                                        orderdUsers = users.OrderByDescending(u => u.CompanyRole.Name);
                                    }
                                    else
                                    {
                                        if (firstOrder.Field == "address")
                                        {
                                            orderdUsers = users.OrderByDescending(u => u.User.Address);
                                        }
                                        else
                                        {
                                            if (firstOrder.Field == "status")
                                            {
                                                orderdUsers = users.OrderByDescending(u => u.User.Status);
                                            }
                                            else
                                            {
                                                orderdUsers = users.OrderByDescending(u => u.User.ContactPhone);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                foreach (var order in criteria.MultiSortMeta) 
                {
                    if (order.Order == 1)
                    {
                        if(order.Field == "username")
                        {
                            orderdUsers = orderdUsers.ThenBy(u => u.User.UserName);
                        }
                        else
                        {
                            if (order.Field == "email")
                            {
                                orderdUsers = orderdUsers.ThenBy(u => u.User.Email);
                            }
                            else
                            {
                                if (order.Field == "firstName")
                                {
                                    orderdUsers = orderdUsers.ThenBy(u => u.User.FirstName);
                                }
                                else
                                {
                                    if (order.Field == "lastName")
                                    {
                                        orderdUsers = orderdUsers.ThenBy(u => u.User.LastName);
                                    }
                                    else
                                    {
                                        if (order.Field == "companyRoleName")
                                        {
                                            orderdUsers = orderdUsers.ThenBy(u => u.CompanyRole.Name);
                                        }
                                        else
                                        {
                                            if (order.Field == "address")
                                            {
                                                orderdUsers = orderdUsers.ThenBy(u => u.User.Address);
                                            }
                                            else
                                            {
                                                if (order.Field == "status")
                                                {
                                                    orderdUsers = orderdUsers.ThenBy(u => u.User.Status);
                                                }
                                                else
                                                {
                                                    orderdUsers = orderdUsers.ThenBy(u => u.User.ContactPhone);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        if (order.Field == "username")
                        {
                            orderdUsers = orderdUsers.ThenByDescending(u => u.User.UserName);
                        }
                        else
                        {
                            if (order.Field == "email")
                            {
                                orderdUsers = orderdUsers.ThenByDescending(u => u.User.Email);
                            }
                            else
                            {
                                if (order.Field == "firstName")
                                {
                                    orderdUsers = orderdUsers.ThenByDescending(u => u.User.FirstName);
                                }
                                else
                                {
                                    if (order.Field == "lastName")
                                    {
                                        orderdUsers = orderdUsers.ThenByDescending(u => u.User.LastName);
                                    }
                                    else
                                    {
                                        if (order.Field == "companyRoleName")
                                        {
                                            orderdUsers = orderdUsers.ThenByDescending(u => u.CompanyRole.Name);
                                        }
                                        else
                                        {
                                            if (order.Field == "address")
                                            {
                                                orderdUsers = orderdUsers.ThenByDescending(u => u.User.Address);
                                            }
                                            else
                                            {
                                                if (order.Field == "status")
                                                {
                                                    orderdUsers = orderdUsers.ThenByDescending(u => u.User.Status);
                                                }
                                                else
                                                {
                                                    orderdUsers = orderdUsers.ThenByDescending(u => u.User.ContactPhone);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return (await orderdUsers.Select(x => x.User).Skip(criteria.First).Take(criteria.Rows).ToListAsync(), numberOfRecords);
            }

            return (await users.Select(x => x.User).Skip(criteria.First).Take(criteria.Rows).ToListAsync(),numberOfRecords);
        }

        public async Task<IEnumerable<User>> GetUsersNotOnProjectAsync(string projectName)
        {
            return dataContext.Users.ToArray().Except(await dataContext.Users
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
                .ToListAsync());
        }
    }
}
