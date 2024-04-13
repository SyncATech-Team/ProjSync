using backAPI.Data;
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
            IEnumerable<int> res = new List<int>();
            var elements = _dataContext.UsersOnIssues.Where(elem => elem.IssueId == issueId && elem.Reporting == false);
            foreach(var elem in elements) {
                res.Append(elem.UserId);
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
            IEnumerable<int> res = new List<int>();
            var elements = _dataContext.IssueDependencies.Where(elem => elem.TargetId == issueId);
            foreach (var elem in elements) {
                res.Append(elem.OriginId);
            }

            return res;
        }
    }
}
