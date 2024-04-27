using backAPI.Data;
using backAPI.DTO.Issues;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface.Issues;
using Google.Protobuf.Collections;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System.Runtime.Serialization.Formatters;
using System.Xml.Linq;

namespace backAPI.Repositories.Implementation.Issues
{
    public class IssueRepository : IIssueRepository
    {

        private readonly DataContext _dataContext;
        private readonly IUserOnIssueRepository _userOnIssueRepository;

        /* *****************************************************************************************
         * Konstruktor
         * ***************************************************************************************** */
        public IssueRepository(DataContext dataContext, IUserOnIssueRepository userOnIssueRepository)
        {
            _dataContext = dataContext;
            _userOnIssueRepository = userOnIssueRepository;
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

            _dataContext.UsersOnIssues.Update(element);
            _dataContext.Issues.Update(issue);

            await _dataContext.SaveChangesAsync();
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

            exists.CreatedDate = model.StartDate.AddDays(1);        // dodatak +1 zbog front-a???
            exists.UpdatedDate = DateTime.Now;
            exists.DueDate = model.EndDate;
            await _dataContext.SaveChangesAsync();
            return true;
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
                await _dataContext.IssueDependencies.AddAsync(new IssueDependencies {
                    OriginId = model.OriginId,
                    TargetId = model.TargetId
                });
            }

            await _dataContext.SaveChangesAsync();
            return true;
        }
    }
}
