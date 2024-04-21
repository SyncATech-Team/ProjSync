using backAPI.Data;
using backAPI.DTO.Issues;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface.Issues;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation.Issues
{
    public class IssueRepository : IIssueRepository
    {

        private readonly DataContext _dataContext;

        /* *****************************************************************************************
         * Konstruktor
         * ***************************************************************************************** */
        public IssueRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
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
            var elements = _dataContext.UsersOnIssues.Where(elem => elem.IssueId == issueId && elem.Reporting == false);
            foreach(var elem in elements) {
                res.Add(elem.UserId);
            }

            return res;
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
