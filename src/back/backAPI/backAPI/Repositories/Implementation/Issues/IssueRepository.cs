using backAPI.Data;
using backAPI.DTO.Issues;
using backAPI.Entities.Domain;
using backAPI.Other.Helpers;
using backAPI.Repositories.Interface;
using backAPI.Repositories.Interface.Issues;
using backAPI.Repositories.Interface.Projects;
using backAPI.SignalR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;

namespace backAPI.Repositories.Implementation.Issues
{
    public class IssueRepository : IIssueRepository
    {

        private readonly DataContext _dataContext;
        private readonly IUserOnIssueRepository _userOnIssueRepository;
        private readonly IUsersRepository _usersRepository;
        private readonly NotificationService _notificationService;
        private readonly INotificationsRepository _notificationsRepository;
        private readonly IProjectsRepository _projectsRepository;
        private readonly IIssueGroupRepository _issueGroupRepository;
        private readonly ILogsRepository _logsRepository;

        /* *****************************************************************************************
         * Konstruktor
         * ***************************************************************************************** */
        public IssueRepository(
            DataContext dataContext, 
            IUserOnIssueRepository userOnIssueRepository, 
            IUsersRepository usersRepository,
            NotificationService notificationService,
            INotificationsRepository notificationRepository,
            ILogsRepository logsRepository,
            IIssueGroupRepository issueGroupRepository,
            IProjectsRepository projectsRepository
        )
        {
            _dataContext = dataContext;
            _userOnIssueRepository = userOnIssueRepository;
            _usersRepository = usersRepository;
            _notificationService = notificationService;
            _notificationsRepository = notificationRepository;
            _projectsRepository = projectsRepository;
            _issueGroupRepository = issueGroupRepository;
            _logsRepository = logsRepository;
        }

        /* *****************************************************************************************
        * Dohvati sve zadatke za odredjenu grupu
        * ***************************************************************************************** */
        public async Task<Issue> GetIssueById(int issueId)
        {
            var issue = await _dataContext.Issues.FirstOrDefaultAsync(i => i.Id == issueId);
            return issue;
        }

        public async Task<IEnumerable<Issue>> GetAllIssuesForGivenGroup(int groupId)
        {
            var tasks = await _dataContext.Issues.Where(t => t.GroupId == groupId).ToListAsync();

            return tasks;
        }

        public async Task<IEnumerable<IssueGroup>> GetAllGroupsForGivenProject(int projectId)
        {
            var groups = await _dataContext.IssueGroups.Where(t => t.ProjectId == projectId).ToListAsync();

            return groups;
        }
        /* *****************************************************************************************
        * Kreiranje zadatka
        * ***************************************************************************************** */
        public async Task<Issue> CreateIssueAsync(Issue task)
        {
            var anyother = await _dataContext.Issues.FirstOrDefaultAsync(t => t.GroupId == task.GroupId && t.Name == task.Name);
            if (anyother != null)
            {
                return null; // postoji task u istoj grupi sa istim imenom
            }

            var group = await _issueGroupRepository.GetGroupAsync(task.GroupId);
            if (group != null) {
                await _logsRepository.AddLogToDatabase(new Log {
                    ProjectId = group.ProjectId,
                    Message = "🆕 New task created. Task name: <strong>" + task.Name + "</strong>",
                    DateCreated = DateTime.Now
                });
            }

            await _dataContext.Issues.AddAsync(task);
            await _dataContext.SaveChangesAsync();
            return task;
        }

        public async Task<bool> AddIssueDependencies(IEnumerable<Tuple<int, int>> dependencies) {
            List<IssueDependencies> dependenciesList = new List<IssueDependencies>();
            foreach (var dependency in dependencies) {
                var exists = await _dataContext.IssueDependencies.FirstOrDefaultAsync<IssueDependencies>(
                    i => i.OriginId == dependency.Item1 && i.TargetId == dependency.Item2);
                if (exists == null)
                    dependenciesList.Add(new IssueDependencies {
                        OriginId = dependency.Item1,
                        TargetId = dependency.Item2,
                    });
            }
            await _dataContext.IssueDependencies.AddRangeAsync(dependenciesList);

            return true;
        }

        public async Task<IEnumerable<int>> GetAssigneeIds(int issueId) {
            List<int> res = new List<int>();
            var elements = await _dataContext.UsersOnIssues.Where(elem => elem.IssueId == issueId && elem.Reporting == false).ToListAsync();
            foreach(var elem in elements) {
                res.Add(elem.UserId);
            }

            return res;
        }

        public async Task<IEnumerable<UsersOnIssueDto>> GetAssigneeCompletionLevel(int issueId)
        {
            List<UsersOnIssueDto> res = new List<UsersOnIssueDto>();
            var elements = await _dataContext.UsersOnIssues.Where(elem => elem.IssueId == issueId && elem.Reporting == false).ToListAsync();

            foreach (var elem in elements)
            {
                UsersOnIssueDto uoidto = new UsersOnIssueDto();
                uoidto.Id = elem.UserId.ToString();
                uoidto.UserId = elem.UserId.ToString();
                uoidto.CompletionLevel = elem.CompletionLevel;
                res.Add(uoidto);
            }

            return res;
        }

        public async Task<double> UpdateAssigneeCompletionLevel(int issueId, UsersOnIssueDto usersOnIssueDto)
        {
            int userId = Int32.Parse(usersOnIssueDto.UserId);
            var element = await _dataContext.UsersOnIssues.SingleOrDefaultAsync(elem => elem.IssueId == issueId && elem.UserId == userId && elem.Reporting == false);
            var usersOnIssueExceptElemenForChanging = await _dataContext.UsersOnIssues.Where(elem => elem.IssueId == issueId && elem.UserId != userId && elem.Reporting == false).ToListAsync();
            var issue = await _dataContext.Issues.FirstOrDefaultAsync(issue => issue.Id == issueId);

            element.CompletionLevel = usersOnIssueDto.CompletionLevel;
            var cl = 0.0;
            if (usersOnIssueExceptElemenForChanging != null)
            {
                cl = usersOnIssueDto.CompletionLevel;
                for (int i = 0; i < usersOnIssueExceptElemenForChanging.Count; i++)
                    cl += usersOnIssueExceptElemenForChanging[i].CompletionLevel;
                cl /= (usersOnIssueExceptElemenForChanging.Count + 1);
                issue.Completed = cl;
            }
            else
            {
                issue.Completed = usersOnIssueDto.CompletionLevel;
            }

            var group = await _issueGroupRepository.GetGroupAsync(issueId);
            if (group != null) {
                await _logsRepository.AddLogToDatabase(new Log {
                    ProjectId = group.ProjectId,
                    Message = "🔄 Progress updated on task <strong> " + issue.Name + "</strong>",
                    DateCreated = DateTime.Now
                });
            }

            _dataContext.UsersOnIssues.Update(element);
            _dataContext.Issues.Update(issue);

            await _dataContext.SaveChangesAsync();
            return cl;
        }

        public async Task<string> DeleteIssue(int issueId) {

            Issue entityToDelete = await _dataContext.Issues.FirstOrDefaultAsync(x => x.Id == issueId);
            if (entityToDelete == null) { return "Issue Not Found"; }

            _dataContext.Issues.Remove(entityToDelete);

            string returnMessage = "OK";
            try {
                await _dataContext.SaveChangesAsync();
                returnMessage = "OK";
            }
            catch (Exception) {
                returnMessage = "Issue has a dependency";
            }

            return returnMessage;
        }

        public async Task<double> DeleteUserOnIssue(int issueId, string userId)
        {
            int userIdToDelete = Int32.Parse(userId);
            var user = await _usersRepository.GetUserById(userIdToDelete);
            var elementToDelete = await _dataContext.UsersOnIssues.SingleOrDefaultAsync(elem => elem.IssueId == issueId && elem.UserId == userIdToDelete && elem.Reporting == false);
            var usersOnIssueExceptElemenForDelete = await _dataContext.UsersOnIssues.Where(elem => elem.IssueId == issueId && elem.UserId != userIdToDelete && elem.Reporting == false).ToListAsync();
            var issue = await _dataContext.Issues.FirstOrDefaultAsync(issue => issue.Id == issueId);

            var cl = 0.0;
            if (usersOnIssueExceptElemenForDelete != null)
            {
                for (int i = 0; i < usersOnIssueExceptElemenForDelete.Count; i++)
                    cl += usersOnIssueExceptElemenForDelete[i].CompletionLevel;
                cl /= (usersOnIssueExceptElemenForDelete.Count);
                issue.Completed = cl;
            }
            else
            {
                issue.Completed = 0.0;
            }

            _dataContext.UsersOnIssues.Remove(elementToDelete);
            _dataContext.Issues.Update(issue);

            await _dataContext.SaveChangesAsync();

            // obavesti korisnika da je uklonjen sa zadatka
            string messageContent = "" +
                "<h4>⛔ You have been removed from a task</h4>" +
                "<strong>Task Name: </strong>" + issue.Name;

            string[] usernames = { user.UserName };
            await _notificationService.NotifyUsers(usernames, messageContent);

            // dodaj notifikaciju u bazu
            List<Notification> notifications = new List<Notification>();
            notifications.Add(new Notification {
                UserId = user.Id,
                Message = messageContent,
                DateCreated = DateTime.Now
            });

            var group = await _issueGroupRepository.GetGroupAsync(issue.GroupId);
            if (group != null) {
                await _logsRepository.AddLogToDatabase(new Log {
                    ProjectId = group.ProjectId,
                    Message = "⛔ User removed from task <strong>" + issue.Name + "</strong>",
                    DateCreated = DateTime.Now
                });
            }

            await _notificationsRepository.AddNotificationRangeAsync(notifications);

            return cl;
        }

        public async Task<int> GetReporterId(int issueId) {
            var e = await _dataContext.UsersOnIssues.SingleOrDefaultAsync(elem => elem.IssueId == issueId && elem.Reporting == true);
            if(e == null) {
                return 0;
            }
            return e.UserId;
        }

        public async Task<IEnumerable<int>> GetDependentIssues(int issueId) {
            var elements = await _dataContext.IssueDependencies
                .Where(elem => elem.OriginId == issueId)
                .ToListAsync();

            return elements.Select(elem => elem.TargetId);
        }

        public async Task<bool> UpdateIssueStartEndDate(int issueId, IssueUpdateDatesDto model) {
            var exists = await _dataContext.Issues.FirstOrDefaultAsync(issue => issue.Id == issueId);
            if(exists == null) {
                return false;
            }

            var group = await _issueGroupRepository.GetGroupAsync(exists.GroupId);

            Project project = await getIssueProject(exists.GroupId);

            Console.WriteLine(project.CreationDate);
            Console.WriteLine(model.StartDate);
            Console.WriteLine(model.EndDate);

            if (project.CreationDate <= model.StartDate && model.StartDate <= model.EndDate) {
                exists.CreatedDate = model.StartDate;
                exists.UpdatedDate = DateTime.Now;
                exists.DueDate = model.EndDate;
                await _dataContext.SaveChangesAsync();

                await _logsRepository.AddLogToDatabase(new Log {
                    ProjectId = group.ProjectId,
                    Message = "ℹ️ Timeline changed for task " +
                    "<strong>" + exists.Name + "</strong>",
                    DateCreated = DateTime.Now
                });

                return true;
            }

            return false;
        }

        public async Task<bool> UpdateIssue(int issueId, JIssueDto model)
        {
            var exists = await _dataContext.Issues.FirstOrDefaultAsync(issue => issue.Id == issueId);
            if (exists == null)
            {
                return false;
            }

            var reporter = await _dataContext.UsersOnIssues.FirstOrDefaultAsync(uoi => uoi.IssueId == issueId && uoi.Reporting == true);
            if (reporter == null)
            {
                return false;
            }

            var existsName = await checkIfExistsIssueWithTheSameNameInsideGroup(exists.Id, exists.GroupId, model.Title);
            if(existsName) {
                return false;
            }

            exists.UpdatedDate = DateTime.Now;
            exists.Description = model.Description;
            exists.Name = model.Title;
            exists.ListPosition = model.ListPosition;
            exists.OwnerId = Int32.Parse(model.ReporterId);
            IssueStatus issueStatus = await _dataContext.IssueStatuses.Where(type => type.Name == model.Status).FirstAsync();
            IssuePriority issuePriority = await _dataContext.IssuePriority.Where(type => type.Name == model.Priority).FirstAsync();
            IssueType issueType = await _dataContext.IssueTypes.Where(type => type.Name == model.Type).FirstAsync();

            exists.StatusId = issueStatus.Id;
            exists.PriorityId = issuePriority.Id;
            exists.TypeId = issueType.Id;

            if (reporter.UserId.ToString() != model.ReporterId)
            {
                reporter.UserId = Int32.Parse(model.ReporterId);
                _dataContext.UsersOnIssues.Update(reporter);
            }

            var result = await _dataContext.SaveChangesAsync();
            if (result > 0) {
                var group = await _issueGroupRepository.GetGroupAsync(issueId);
                if (group != null) {
                    await _logsRepository.AddLogToDatabase(new Log {
                        ProjectId = group.ProjectId,
                        Message = "🔄 Task <strong> " + exists.Name + "</strong> updated",
                        DateCreated = DateTime.Now
                    });
                }
            }
            return true;
        }

        public async Task<double> UpdateUsersOnIssue(int issueId, UsersOnIssueDto model)
        {
            var issue = await _dataContext.Issues.FirstOrDefaultAsync(issue => issue.Id == issueId);
            var existingUsersOnIssue = await _dataContext.UsersOnIssues.Where(uoi => uoi.IssueId == issueId && uoi.Reporting == false).ToListAsync();
            if (issue == null)
            {
                return -1;
            }

            UsersOnIssue newUserOnIssue = new UsersOnIssue
            {
                UserId = Int32.Parse(model.UserId),
                IssueId = issueId,
                Reporting = false,
                CompletionLevel = 0.0
            };

            await _dataContext.UsersOnIssues.AddAsync(newUserOnIssue);

            // posalji korisniku notifikaciju da je dodat na zadatak
            // obavesti korisnika da je uklonjen sa zadatka
            string messageContent = "" +
                "<h4>🆕 You have been assigned a new task</h4>" +
                "<span style='background: red;'><strong>Due Date: </strong>" + issue.DueDate.ToLongDateString() + "</span>" +
                "<br>" +
                "<strong>Task Name: </strong>" + issue.Name +
                "<br>" +
                "<strong>Assignee/Reporter: Assignee</strong>";

            var user = await _usersRepository.GetUserById(Int32.Parse(model.UserId));

            string[] usernames = { user.UserName };
            await _notificationService.NotifyUsers(usernames, messageContent);

            // dodaj notifikaciju u bazu
            List<Notification> notifications = new List<Notification>();
            notifications.Add(new Notification {
                UserId = user.Id,
                Message = messageContent,
                DateCreated = DateTime.Now
            });

            var group = await _issueGroupRepository.GetGroupAsync(issueId);
            if (group != null) {
                await _logsRepository.AddLogToDatabase(new Log {
                    ProjectId = group.ProjectId,
                    Message = "🚀 Users added on task <strong> " + issue.Name + "</strong>",
                    DateCreated = DateTime.Now
                });
            }

            await _notificationsRepository.AddNotificationRangeAsync(notifications);

            var newCl = 0.0;
            if (existingUsersOnIssue != null)
            {
                for (int i = 0; i < existingUsersOnIssue.Count; i++)
                    newCl += existingUsersOnIssue[i].CompletionLevel;
                newCl /= (existingUsersOnIssue.Count + 1);

                issue.Completed = newCl;
            }
            // nema user-a tako da je zavrsenost 0%
            else
            {
                issue.Completed = 0.0;
            }

            await _dataContext.SaveChangesAsync();
            return newCl;
        }

        public async Task<bool> CreateOrDeleteDependency(IssueDependenciesUpdateDto model) {
            if(model.IsDelete) {
                await _dataContext.IssueDependencies
                    .Where(elem => elem.OriginId == model.OriginId && elem.TargetId == model.TargetId)
                    .ExecuteDeleteAsync();
            }
            else {
                bool exists = await _dataContext.IssueDependencies.AnyAsync(
                    elem => elem.OriginId == model.OriginId && elem.TargetId == model.TargetId
                );

                if(!exists) {
                    await _dataContext.IssueDependencies.AddAsync(new IssueDependencies {
                        OriginId = model.OriginId,
                        TargetId = model.TargetId
                    });
                }
            }

            await _dataContext.SaveChangesAsync();
            return true;
        }

        public async Task<(IEnumerable<Issue> issues, int numberOfRecords)> GetPaginationIssuesForProject(int projectId, Criteria criteria)
        {
            var issues = _dataContext.Issues
                    .Join(_dataContext.IssueGroups,
                         i => i.GroupId,
                         ig => ig.Id,
                         (i, ig) => new { Issue = i, Group = ig })
                    .Where(i => i.Group.ProjectId == projectId)
                    .Join(_dataContext.UsersOnIssues,
                         i => i.Issue.Id,
                         ui => ui.IssueId,
                         (i, ui) => new { i.Issue, i.Group, UserOnIssue = ui })
                    .Where(i => i.UserOnIssue.Reporting == true)
                    .Join(_dataContext.Users,
                         ui => ui.UserOnIssue.UserId,
                         u => u.Id,
                         (ui, u) => new { ui.Issue, ui.Group, Reporter = u })
                    .Join(_dataContext.IssueTypes,
                         i => i.Issue.TypeId,
                         it => it.Id,
                         (i, it) => new { i.Issue, i.Group, i.Reporter, IssueType = it })
                    .Join(_dataContext.IssuePriority,
                         i => i.Issue.PriorityId,
                         ip => ip.Id,
                         (i, ip) => new { i.Issue, i.Group, i.Reporter, i.IssueType, IssuePriority = ip })
                    .Join(_dataContext.IssueStatuses,
                         i => i.Issue.StatusId,
                         iss => iss.Id,
                         (i, iss) => new { i.Issue, i.Group, i.Reporter, i.IssueType, i.IssuePriority, IssueStatus = iss});

            if (criteria.Filters.Count > 0)
            {
                var issues2 = issues;
                var issues3 = issues;
                foreach(var filter in criteria.Filters)
                {
                    issues2 = issues;
                    issues3 = issues.Where(i => i.Issue.Name==null);
                    foreach (var fieldFilter in filter.Fieldfilters)
                    {
                        if (fieldFilter.Value.GetType() == typeof(string))
                        {
                            if (fieldFilter.MatchMode == "startsWith")
                            {
                                if (filter.Field == "name")
                                {
                                    issues2 = issues.Where(i => i.Issue.Name.ToLower().StartsWith((string)fieldFilter.Value));
                                }
                                else
                                {
                                    issues2 = issues.Where(i => i.Reporter.UserName.ToLower().StartsWith((string)fieldFilter.Value));
                                }
                            }
                            else
                            {
                                if (fieldFilter.MatchMode == "contains")
                                {
                                    if (filter.Field == "name")
                                    {
                                        issues2 = issues.Where(i => i.Issue.Name.ToLower().Contains((string)fieldFilter.Value));
                                    }
                                    else
                                    {
                                        issues2 = issues.Where(i => i.Reporter.UserName.ToLower().Contains((string)fieldFilter.Value));
                                    }
                                }
                                else
                                {
                                    if (fieldFilter.MatchMode == "notContains")
                                    {
                                        if (filter.Field == "name")
                                        {
                                            issues2 = issues.Where(i => !i.Issue.Name.ToLower().Contains((string)fieldFilter.Value));
                                        }
                                        else
                                        {
                                            issues2 = issues.Where(i => !i.Reporter.UserName.ToLower().Contains((string)fieldFilter.Value));
                                        }
                                    }
                                    else
                                    {
                                        if (fieldFilter.MatchMode == "endsWith")
                                        {
                                            if (filter.Field == "name")
                                            {
                                                issues2 = issues.Where(i => i.Issue.Name.ToLower().EndsWith((string)fieldFilter.Value));
                                            }
                                            else
                                            {
                                                issues2 = issues.Where(i => i.Reporter.UserName.ToLower().EndsWith((string)fieldFilter.Value));
                                            }
                                        }
                                        else
                                        {
                                            if (fieldFilter.MatchMode == "equals")
                                            {
                                                if (filter.Field == "name")
                                                {
                                                    issues2 = issues.Where(i => i.Issue.Name.ToLower().Equals((string)fieldFilter.Value));
                                                }
                                                else
                                                {
                                                    issues2 = issues.Where(i => i.Reporter.UserName.ToLower().Equals((string)fieldFilter.Value));
                                                }
                                            }
                                            else
                                            {
                                                if (fieldFilter.MatchMode == "notEquals")
                                                {
                                                    if (filter.Field == "name")
                                                    {
                                                        issues2 = issues.Where(i => !i.Issue.Name.ToLower().Equals((string)fieldFilter.Value));
                                                    }
                                                    else
                                                    {
                                                        issues2 = issues.Where(i => !i.Reporter.UserName.ToLower().Equals((string)fieldFilter.Value));
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
                                    if (filter.Field == "createdDate")
                                    {
                                        issues2 = issues.Where(i => i.Issue.CreatedDate.Date.Equals(((DateTime)fieldFilter.Value).AddDays(1).Date)); 
                                    }
                                    else
                                    {
                                        if (filter.Field == "dueDate")
                                        {
                                            issues2 = issues.Where(i => i.Issue.DueDate.Date.Equals(((DateTime)fieldFilter.Value).AddDays(1).Date));
                                        }
                                        else
                                        {
                                            issues2 = issues.Where(i => i.Issue.UpdatedDate.Date.Equals(((DateTime)fieldFilter.Value).AddDays(1).Date));
                                        }
                                    }
                                }
                                else
                                {
                                    if (fieldFilter.MatchMode == "dateIsNot")
                                    {
                                        if (filter.Field == "createdDate")
                                        {
                                            issues2 = issues.Where(i => !i.Issue.CreatedDate.Date.Equals(((DateTime)fieldFilter.Value).AddDays(1).Date));
                                        }
                                        else
                                        {
                                            if (filter.Field == "dueDate")
                                            {
                                                issues2 = issues.Where(i => !i.Issue.DueDate.Date.Equals(((DateTime)fieldFilter.Value).AddDays(1).Date));
                                            }
                                            else
                                            {
                                                issues2 = issues.Where(i => !i.Issue.UpdatedDate.Date.Equals(((DateTime)fieldFilter.Value).AddDays(1).Date));
                                            }
                                        }
                                    }
                                    else
                                    {
                                        if (fieldFilter.MatchMode == "dateAfter")
                                        {
                                            if (filter.Field == "createdDate")
                                            {
                                                issues2 = issues.Where(i => i.Issue.CreatedDate.Date > (((DateTime)fieldFilter.Value).AddDays(1).Date));
                                            }
                                            else
                                            {
                                                if (filter.Field == "dueDate")
                                                {
                                                    issues2 = issues.Where(i => i.Issue.DueDate.Date > (((DateTime)fieldFilter.Value).AddDays(1).Date));
                                                }
                                                else
                                                {
                                                    issues2 = issues.Where(i => i.Issue.UpdatedDate.Date > (((DateTime)fieldFilter.Value).AddDays(1).Date));
                                                }
                                            }
                                        }
                                        else
                                        {
                                            if (fieldFilter.MatchMode == "dateBefore")
                                            {
                                                if (filter.Field == "createdDate")
                                                {
                                                    issues2 = issues.Where(i => i.Issue.CreatedDate.Date < (((DateTime)fieldFilter.Value).AddDays(1).Date));
                                                }
                                                else
                                                {
                                                    if (filter.Field == "dueDate")
                                                    {
                                                        issues2 = issues.Where(i => i.Issue.DueDate.Date < (((DateTime)fieldFilter.Value).AddDays(1).Date));
                                                    }
                                                    else
                                                    {
                                                        issues2 = issues.Where(i => i.Issue.UpdatedDate.Date < (((DateTime)fieldFilter.Value).AddDays(1).Date));
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else
                            {
                                if (fieldFilter.Value.GetType() == typeof(JArray))
                                {
                                    if(filter.Field == "typeName")
                                    {
                                        issues2 = issues.Where(i => (((JArray)fieldFilter.Value).ToObject<List<string>>()).Contains(i.IssueType.Name));
                                    }
                                    else
                                    {
                                        if (filter.Field == "statusName")
                                        {
                                            issues2 = issues.Where(i => (((JArray)fieldFilter.Value).ToObject<List<string>>()).Contains(i.IssueStatus.Name));
                                        }
                                        else
                                        {
                                            if (filter.Field == "priorityName")
                                            {
                                                issues2 = issues.Where(i => (((JArray)fieldFilter.Value).ToObject<List<string>>()).Contains(i.IssuePriority.Name));
                                            }
                                            else
                                            {
                                                if (filter.Field == "groupName")
                                                {
                                                    issues2 = issues.Where(i => (((JArray)fieldFilter.Value).ToObject<List<string>>()).Contains(i.Group.Name));
                                                }
                                                else
                                                {
                                                    issues2 = issues.Where(i => (((JArray)fieldFilter.Value).ToObject<List<double>>()[0]) <= i.Issue.Completed && (((JArray)fieldFilter.Value).ToObject<List<double>>()[1]) >= i.Issue.Completed);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (fieldFilter.Operator == "or")
                        {
                            issues3 = issues3.Union(issues2);
                        }
                        else
                        {
                            issues = issues2;
                            issues3 = issues;
                        }
                    }
                    issues = issues3;
                }
            }

            int numberOfRecords = issues.Count();

            if(criteria.MultiSortMeta.Count > 0)
            {
                MultiSortMeta firstOrder = criteria.MultiSortMeta[0];
                criteria.MultiSortMeta.RemoveAt(0);
                var orderdIssues = issues.OrderBy(i => i.Issue.Name);

                if(firstOrder.Order == 1)
                {
                    if(firstOrder.Field == "name")
                    {
                        orderdIssues = issues.OrderBy(i => i.Issue.Name);
                    }
                    else
                    {
                        if (firstOrder.Field == "createdDate")
                        {
                            orderdIssues = issues.OrderBy(i => i.Issue.CreatedDate);
                        }
                        else
                        {
                            if (firstOrder.Field == "dueDate")
                            {
                                orderdIssues = issues.OrderBy(i => i.Issue.DueDate);
                            }
                            else
                            {
                                if (firstOrder.Field == "updatedDate")
                                {
                                    orderdIssues = issues.OrderBy(i => i.Issue.UpdatedDate);
                                }
                                else
                                {
                                    if (firstOrder.Field == "typeName")
                                    {
                                        orderdIssues = issues.OrderBy(i => i.IssueType.Name);
                                    }
                                    else
                                    {
                                        if (firstOrder.Field == "statusName")
                                        {
                                            orderdIssues = issues.OrderBy(i => i.IssueStatus.Name);
                                        }
                                        else
                                        {
                                            if (firstOrder.Field == "priorityName")
                                            {
                                                orderdIssues = issues.OrderBy(i => i.IssuePriority.Name);
                                            }
                                            else
                                            {
                                                if (firstOrder.Field == "groupName")
                                                {
                                                    orderdIssues = issues.OrderBy(i => i.Group.Name);
                                                }
                                                else
                                                {
                                                    if (firstOrder.Field == "completed")
                                                    {
                                                        orderdIssues = issues.OrderBy(i => i.Issue.Completed);
                                                    }
                                                    else
                                                    {
                                                        orderdIssues = issues.OrderBy(i => i.Reporter.UserName);
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
                    if (firstOrder.Field == "name")
                    {
                        orderdIssues = issues.OrderByDescending(i => i.Issue.Name);
                    }
                    else
                    {
                        if (firstOrder.Field == "createdDate")
                        {
                            orderdIssues = issues.OrderByDescending(i => i.Issue.CreatedDate);
                        }
                        else
                        {
                            if (firstOrder.Field == "dueDate")
                            {
                                orderdIssues = issues.OrderByDescending(i => i.Issue.DueDate);
                            }
                            else
                            {
                                if (firstOrder.Field == "updatedDate")
                                {
                                    orderdIssues = issues.OrderByDescending(i => i.Issue.UpdatedDate);
                                }
                                else
                                {
                                    if (firstOrder.Field == "typeName")
                                    {
                                        orderdIssues = issues.OrderByDescending(i => i.IssueType.Name);
                                    }
                                    else
                                    {
                                        if (firstOrder.Field == "statusName")
                                        {
                                            orderdIssues = issues.OrderByDescending(i => i.IssueStatus.Name);
                                        }
                                        else
                                        {
                                            if (firstOrder.Field == "priorityName")
                                            {
                                                orderdIssues = issues.OrderByDescending(i => i.IssuePriority.Name);
                                            }
                                            else
                                            {
                                                if (firstOrder.Field == "groupName")
                                                {
                                                    orderdIssues = issues.OrderByDescending(i => i.Group.Name);
                                                }
                                                else
                                                {
                                                    if (firstOrder.Field == "completed")
                                                    {
                                                        orderdIssues = issues.OrderByDescending(i => i.Issue.Completed);
                                                    }
                                                    else
                                                    {
                                                        orderdIssues = issues.OrderByDescending(i => i.Reporter.UserName);
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
                foreach(var order in criteria.MultiSortMeta)
                {
                    if (order.Order == 1)
                    {
                        if (order.Field == "name")
                        {
                            orderdIssues = orderdIssues.ThenBy(i => i.Issue.Name);
                        }
                        else
                        {
                            if (order.Field == "createdDate")
                            {
                                orderdIssues = orderdIssues.ThenBy(i => i.Issue.CreatedDate);
                            }
                            else
                            {
                                if (order.Field == "dueDate")
                                {
                                    orderdIssues = orderdIssues.ThenBy(i => i.Issue.DueDate);
                                }
                                else
                                {
                                    if (order.Field == "updatedDate")
                                    {
                                        orderdIssues = orderdIssues.ThenBy(i => i.Issue.UpdatedDate);
                                    }
                                    else
                                    {
                                        if (order.Field == "typeName")
                                        {
                                            orderdIssues = orderdIssues.ThenBy(i => i.IssueType.Name);
                                        }
                                        else
                                        {
                                            if (order.Field == "statusName")
                                            {
                                                orderdIssues = orderdIssues.ThenBy(i => i.IssueStatus.Name);
                                            }
                                            else
                                            {
                                                if (order.Field == "priorityName")
                                                {
                                                    orderdIssues = orderdIssues.ThenBy(i => i.IssuePriority.Name);
                                                }
                                                else
                                                {
                                                    if (order.Field == "groupName")
                                                    {
                                                        orderdIssues = orderdIssues.ThenBy(i => i.Group.Name);
                                                    }
                                                    else
                                                    {
                                                        if (order.Field == "completed")
                                                        {
                                                            orderdIssues = orderdIssues.ThenBy(i => i.Issue.Completed);
                                                        }
                                                        else
                                                        {
                                                            orderdIssues = orderdIssues.ThenBy(i => i.Reporter.UserName);
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
                        if (order.Field == "name")
                        {
                            orderdIssues = orderdIssues.ThenByDescending(i => i.Issue.Name);
                        }
                        else
                        {
                            if (order.Field == "createdDate")
                            {
                                orderdIssues = orderdIssues.ThenByDescending(i => i.Issue.CreatedDate);
                            }
                            else
                            {
                                if (order.Field == "dueDate")
                                {
                                    orderdIssues = orderdIssues.ThenByDescending(i => i.Issue.DueDate);
                                }
                                else
                                {
                                    if (order.Field == "updatedDate")
                                    {
                                        orderdIssues = orderdIssues.ThenByDescending(i => i.Issue.UpdatedDate);
                                    }
                                    else
                                    {
                                        if (order.Field == "typeName")
                                        {
                                            orderdIssues = orderdIssues.ThenByDescending(i => i.IssueType.Name);
                                        }
                                        else
                                        {
                                            if (order.Field == "statusName")
                                            {
                                                orderdIssues = orderdIssues.ThenByDescending(i => i.IssueStatus.Name);
                                            }
                                            else
                                            {
                                                if (order.Field == "priorityName")
                                                {
                                                    orderdIssues = orderdIssues.ThenByDescending(i => i.IssuePriority.Name);
                                                }
                                                else
                                                {
                                                    if (order.Field == "groupName")
                                                    {
                                                        orderdIssues = orderdIssues.ThenByDescending(i => i.Group.Name);
                                                    }
                                                    else
                                                    {
                                                        if (order.Field == "completed")
                                                        {
                                                            orderdIssues = orderdIssues.ThenByDescending(i => i.Issue.Completed);
                                                        }
                                                        else
                                                        {
                                                            orderdIssues = orderdIssues.ThenByDescending(i => i.Reporter.UserName);
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
                }
                return (await orderdIssues.Select(i => i.Issue).Skip(criteria.First).Take(criteria.Rows).ToListAsync(), numberOfRecords);
            }

            return ( await issues.Select(i => i.Issue).Skip(criteria.First).Take(criteria.Rows).ToListAsync(), numberOfRecords);
        }

        private async Task<Project> getIssueProject(int groupId) {
            var group = await _issueGroupRepository.GetGroupAsync(groupId);
            var project = await _projectsRepository.GetProjectById(group.ProjectId);
            return project;
        }

        private async Task<bool> checkIfExistsIssueWithTheSameNameInsideGroup(int issueId, int groupId, string candidateName) {
            var exists = await _dataContext.Issues.Where(
                issue =>    issue.Id != issueId &&
                            issue.GroupId == groupId &&
                            issue.Name == candidateName
            ).ToListAsync();

            return exists.Any();
        }

    }
}
