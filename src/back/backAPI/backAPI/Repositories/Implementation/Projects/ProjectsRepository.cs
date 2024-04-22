﻿using backAPI.Data;
using backAPI.DTO.Projects;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using backAPI.Repositories.Interface.Projects;
using backAPI.Repositories.Interface.Issues;
using Microsoft.EntityFrameworkCore;
using backAPI.Other.Helpers;
using Newtonsoft.Json.Linq;

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

        public async Task<(IEnumerable<Project> projects, int numberOfRecords)> GetPaginationProjectsForUserAsync(string username, Criteria criteria)
        {
            var projects = dataContext.Users
                .Join(dataContext.UsersOnProjects,
                    u => u.Id,
                    up => up.UserId,
                    (u, up) => new { User = u, UserProject = up })
                .Join(dataContext.Projects,
                    up => up.UserProject.ProjectId,
                    p => p.Id,
                    (up, p) => new { up.User, Project = p })
                .Join(dataContext.ProjectTypes,
                    p => p.Project.TypeId,
                    pt => pt.Id,
                    (p, pt) => new { p.Project, p.User, ProjectType = pt })
                .Join(dataContext.Users,
                    p => p.Project.OwnerId,
                    uo => uo.Id,
                    (p, uo) => new { p.Project, p.User, p.ProjectType, Owner = uo })
                .Where(x => x.User.UserName == username);


            if (criteria.Filters.Count > 0)
            {
                foreach (var filter in criteria.Filters)
                {
                    foreach (var fieldFilter in filter.Fieldfilters)
                    {
                        if (fieldFilter.Value.GetType() == typeof(string))
                        {
                            if (fieldFilter.MatchMode == "startsWith")
                            {
                                if (filter.Field == "name")
                                {
                                    projects = projects.Where(p => p.Project.Name.StartsWith((string)fieldFilter.Value));
                                }
                                else
                                {
                                    if (filter.Field == "key")
                                    {
                                        projects = projects.Where(p => p.Project.Key.StartsWith((string)fieldFilter.Value));
                                    }
                                    else
                                    {
                                        if (filter.Field == "ownerUsername")
                                        {
                                            projects = projects.Where(p => p.Owner.UserName.StartsWith((string)fieldFilter.Value));
                                        }
                                        else
                                        {
                                            projects = projects.Where(p => p.Project.Description.StartsWith((string)fieldFilter.Value));
                                        }
                                    }
                                }
                            }
                            else
                            {
                                if (fieldFilter.MatchMode == "contains")
                                {
                                    if (filter.Field == "name")
                                    {
                                        projects = projects.Where(p => p.Project.Name.Contains((string)fieldFilter.Value));
                                    }
                                    else
                                    {
                                        if (filter.Field == "key")
                                        {
                                            projects = projects.Where(p => p.Project.Key.Contains((string)fieldFilter.Value));
                                        }
                                        else
                                        {
                                            if (filter.Field == "ownerUsername")
                                            {
                                                projects = projects.Where(p => p.Owner.UserName.Contains((string)fieldFilter.Value));
                                            }
                                            else
                                            {
                                                projects = projects.Where(p => p.Project.Description.Contains((string)fieldFilter.Value));
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    if (fieldFilter.MatchMode == "notContains")
                                    {
                                        if (filter.Field == "name")
                                        {
                                            projects = projects.Where(p => !p.Project.Name.Contains((string)fieldFilter.Value));
                                        }
                                        else
                                        {
                                            if (filter.Field == "key")
                                            {
                                                projects = projects.Where(p => !p.Project.Key.Contains((string)fieldFilter.Value));
                                            }
                                            else
                                            {
                                                if (filter.Field == "ownerUsername")
                                                {
                                                    projects = projects.Where(p => !p.Owner.UserName.Contains((string)fieldFilter.Value));
                                                }
                                                else
                                                {
                                                    projects = projects.Where(p => !p.Project.Description.Contains((string)fieldFilter.Value));
                                                }
                                            }
                                        }
                                    }
                                    else
                                    {
                                        if (fieldFilter.MatchMode == "endsWith")
                                        {
                                            if (filter.Field == "name")
                                            {
                                                projects = projects.Where(p => p.Project.Name.EndsWith((string)fieldFilter.Value));
                                            }
                                            else
                                            {
                                                if (filter.Field == "key")
                                                {
                                                    projects = projects.Where(p => p.Project.Key.EndsWith((string)fieldFilter.Value));
                                                }
                                                else
                                                {
                                                    if (filter.Field == "ownerUsername")
                                                    {
                                                        projects = projects.Where(p => p.Owner.UserName.EndsWith((string)fieldFilter.Value));
                                                    }
                                                    else
                                                    {
                                                        projects = projects.Where(p => p.Project.Description.EndsWith((string)fieldFilter.Value));
                                                    }
                                                }
                                            }
                                        }
                                        else
                                        {
                                            if (fieldFilter.MatchMode == "equals")
                                            {
                                                if (filter.Field == "name")
                                                {
                                                    projects = projects.Where(p => p.Project.Name.Equals((string)fieldFilter.Value));
                                                }
                                                else
                                                {
                                                    if (filter.Field == "key")
                                                    {
                                                        projects = projects.Where(p => p.Project.Key.Equals((string)fieldFilter.Value));
                                                    }
                                                    else
                                                    {
                                                        if (filter.Field == "ownerUsername")
                                                        {
                                                            projects = projects.Where(p => p.Owner.UserName.Equals((string)fieldFilter.Value));
                                                        }
                                                        else
                                                        {
                                                            projects = projects.Where(p => p.Project.Description.Equals((string)fieldFilter.Value));
                                                        }
                                                    }
                                                }
                                            }
                                            else
                                            {
                                                if (fieldFilter.MatchMode == "notEquals")
                                                {
                                                    if (filter.Field == "name")
                                                    {
                                                        projects = projects.Where(p => !p.Project.Name.Equals((string)fieldFilter.Value));
                                                    }
                                                    else
                                                    {
                                                        if (filter.Field == "key")
                                                        {
                                                            projects = projects.Where(p => !p.Project.Key.Equals((string)fieldFilter.Value));
                                                        }
                                                        else
                                                        {
                                                            if (filter.Field == "ownerUsername")
                                                            {
                                                                projects = projects.Where(p => !p.Owner.UserName.Equals((string)fieldFilter.Value));
                                                            }
                                                            else
                                                            {
                                                                projects = projects.Where(p => !p.Project.Description.Equals((string)fieldFilter.Value));
                                                            }
                                                        }
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
                            if (fieldFilter.Value.GetType() == typeof(DateTime))
                            {
                                if (fieldFilter.MatchMode == "dateIs")
                                {
                                    if (filter.Field == "creationDate")
                                    {
                                        projects = projects.Where(p => p.Project.CreationDate.Date.Equals(((DateTime)fieldFilter.Value).AddDays(1).Date));
                                    }
                                    else
                                    {
                                        projects = projects.Where(p => p.Project.DueDate.Date.Equals(((DateTime)fieldFilter.Value).AddDays(1).Date));
                                    }
                                }
                                else
                                {
                                    if (fieldFilter.MatchMode == "dateIsNot")
                                    {
                                        if (filter.Field == "creationDate")
                                        {
                                            projects = projects.Where(p => !p.Project.CreationDate.Date.Equals(((DateTime)fieldFilter.Value).AddDays(1).Date));
                                        }
                                        else
                                        {
                                            projects = projects.Where(p => !p.Project.DueDate.Date.Equals(((DateTime)fieldFilter.Value).AddDays(1).Date));
                                        }
                                    }
                                    else
                                    {
                                        if (fieldFilter.MatchMode == "dateAfter")
                                        {
                                            if (filter.Field == "creationDate")
                                            {
                                                projects = projects.Where(p => p.Project.CreationDate.Date > (((DateTime)fieldFilter.Value).AddDays(1).Date));
                                            }
                                            else
                                            {
                                                projects = projects.Where(p => p.Project.DueDate.Date > (((DateTime)fieldFilter.Value).AddDays(1).Date));
                                            }
                                        }
                                        else
                                        {
                                            if (fieldFilter.MatchMode == "dateBefore")
                                            {
                                                if (filter.Field == "creationDate")
                                                {
                                                    projects = projects.Where(p => p.Project.CreationDate.Date < (((DateTime)fieldFilter.Value).AddDays(1).Date));
                                                }
                                                else
                                                {
                                                    projects = projects.Where(p => p.Project.DueDate.Date < (((DateTime)fieldFilter.Value).AddDays(1).Date));
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else
                            {
                                projects = projects.Where(p => (((JArray)fieldFilter.Value).ToObject<List<string>>()).Contains(p.ProjectType.Name));
                            }
                        }
                    }
                }
            }




            int numberOfRecords = projects.Count();

            if (criteria.MultiSortMeta.Count > 0)
            {
                MultiSortMeta firstOrder = criteria.MultiSortMeta[0];
                criteria.MultiSortMeta.RemoveAt(0);
                var orderedProjects = projects.OrderBy(p => p.Project.Name);

                if (firstOrder.Order == 1)
                {
                    if (firstOrder.Field == "name")
                    {
                        orderedProjects = projects.OrderBy(p => p.Project.Name);
                    }
                    else
                    {
                        if (firstOrder.Field == "key")
                        {
                            orderedProjects = projects.OrderBy(p => p.Project.Key);
                        }
                        else
                        {
                            if (firstOrder.Field == "description")
                            {
                                orderedProjects = projects.OrderBy(p => p.Project.Description);
                            }
                            else
                            {
                                if (firstOrder.Field == "typeName")
                                {
                                    orderedProjects = projects.OrderBy(p => p.ProjectType.Name);
                                }
                                else
                                {
                                    if (firstOrder.Field == "creationDate")
                                    {
                                        orderedProjects = projects.OrderBy(p => p.Project.CreationDate);
                                    }
                                    else
                                    {
                                        if (firstOrder.Field == "dueDate")
                                        {
                                            orderedProjects = projects.OrderBy(p => p.Project.DueDate);
                                        }
                                        else
                                        {
                                            if (firstOrder.Field == "ownerUsername")
                                            {
                                                orderedProjects = projects.OrderBy(p => p.Owner.UserName);
                                            }
                                            else
                                            {
                                                orderedProjects = projects.OrderBy(p => p.Project.Budget);
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
                    if (firstOrder.Field == "name")
                    {
                        orderedProjects = projects.OrderByDescending(p => p.Project.Name);
                    }
                    else
                    {
                        if (firstOrder.Field == "key")
                        {
                            orderedProjects = projects.OrderByDescending(p => p.Project.Key);
                        }
                        else
                        {
                            if (firstOrder.Field == "description")
                            {
                                orderedProjects = projects.OrderByDescending(p => p.Project.Description);
                            }
                            else
                            {
                                if (firstOrder.Field == "typeName")
                                {
                                    orderedProjects = projects.OrderByDescending(p => p.ProjectType.Name);
                                }
                                else
                                {
                                    if (firstOrder.Field == "creationDate")
                                    {
                                        orderedProjects = projects.OrderByDescending(p => p.Project.CreationDate);
                                    }
                                    else
                                    {
                                        if (firstOrder.Field == "dueDate")
                                        {
                                            orderedProjects = projects.OrderByDescending(p => p.Project.DueDate);
                                        }
                                        else
                                        {
                                            if (firstOrder.Field == "ownerUsername")
                                            {
                                                orderedProjects = projects.OrderByDescending(p => p.Owner.UserName);
                                            }
                                            else
                                            {
                                                orderedProjects = projects.OrderByDescending(p => p.Project.Budget);
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
                        if (order.Field == "name")
                        {
                            orderedProjects = orderedProjects.ThenBy(p => p.Project.Name);
                        }
                        else
                        {
                            if (order.Field == "key")
                            {
                                orderedProjects = orderedProjects.ThenBy(p => p.Project.Key);
                            }
                            else
                            {
                                if (order.Field == "description")
                                {
                                    orderedProjects = orderedProjects.ThenBy(p => p.Project.Description);
                                }
                                else
                                {
                                    if (order.Field == "typeName")
                                    {
                                        orderedProjects = orderedProjects.ThenBy(p => p.ProjectType.Name);
                                    }
                                    else
                                    {
                                        if (order.Field == "creationDate")
                                        {
                                            orderedProjects = orderedProjects.ThenBy(p => p.Project.CreationDate);
                                        }
                                        else
                                        {
                                            if (order.Field == "dueDate")
                                            {
                                                orderedProjects = orderedProjects.ThenBy(p => p.Project.DueDate);
                                            }
                                            else
                                            {
                                                if (order.Field == "ownerUsername")
                                                {
                                                    orderedProjects = orderedProjects.ThenBy(p => p.Owner.UserName);
                                                }
                                                else
                                                {
                                                    orderedProjects = orderedProjects.ThenBy(p => p.Project.Budget);
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
                        if (order.Field == "name")
                        {
                            orderedProjects = orderedProjects.ThenByDescending(p => p.Project.Name);
                        }
                        else
                        {
                            if (order.Field == "key")
                            {
                                orderedProjects = orderedProjects.ThenByDescending(p => p.Project.Key);
                            }
                            else
                            {
                                if (order.Field == "description")
                                {
                                    orderedProjects = orderedProjects.ThenByDescending(p => p.Project.Description);
                                }
                                else
                                {
                                    if (order.Field == "typeName")
                                    {
                                        orderedProjects = orderedProjects.ThenByDescending(p => p.ProjectType.Name);
                                    }
                                    else
                                    {
                                        if (order.Field == "creationDate")
                                        {
                                            orderedProjects = orderedProjects.ThenByDescending(p => p.Project.CreationDate);
                                        }
                                        else
                                        {
                                            if (order.Field == "dueDate")
                                            {
                                                orderedProjects = orderedProjects.ThenByDescending(p => p.Project.DueDate);
                                            }
                                            else
                                            {
                                                if (order.Field == "ownerUsername")
                                                {
                                                    orderedProjects = orderedProjects.ThenByDescending(p => p.Owner.UserName);
                                                }
                                                else
                                                {
                                                    orderedProjects = orderedProjects.ThenByDescending(p => p.Project.Budget);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return (await orderedProjects.Select(x => x.Project).Skip(criteria.First).Take(criteria.Rows).ToListAsync(), numberOfRecords);
            }


            return (await projects.Select(x => x.Project).Skip(criteria.First).Take(criteria.Rows).ToListAsync(), numberOfRecords);
        }
    }
}
