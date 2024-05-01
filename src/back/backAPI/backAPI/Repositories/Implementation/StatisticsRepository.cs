using backAPI.Data;
using backAPI.Repositories.Interface;
using backAPI.Repositories.Interface.Issues;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation {
    public class StatisticsRepository : IStatisticsRepository {

        private readonly DataContext dataContext;
        private readonly IIssueGroupRepository issueGroupRepository;

        public StatisticsRepository(
            DataContext dataContext,
            IIssueGroupRepository issueGroupRepository
        ) {
            this.dataContext = dataContext;
            this.issueGroupRepository = issueGroupRepository;
        }


        public async Task<Dictionary<string, int>> GetNumberOfTasksPerIssueTypeInProject(int projectId) {
            var issuesForProject = await (
                from issue in dataContext.Issues
                join issueGroup in dataContext.IssueGroups on issue.GroupId equals issueGroup.Id
                where issueGroup.ProjectId == projectId
                select issue
            ).ToListAsync();

            Dictionary<string, int> result = new Dictionary<string, int>();
            foreach(var type in dataContext.IssueTypes) {
                result.Add(
                    key: type.Name,
                    value: issuesForProject.Where(i => i.TypeId == type.Id).Count()
                );
            }

            return result;
        }

        public async Task<Dictionary<string, int>> GetNumberOfTasksPerIssuePriorityProject(int projectId) {
            var issuesForProject = await (
                from issue in dataContext.Issues
                join issueGroup in dataContext.IssueGroups on issue.GroupId equals issueGroup.Id
                where issueGroup.ProjectId == projectId
                select issue
            ).ToListAsync();

            Dictionary<string, int> result = new Dictionary<string, int>();
            foreach (var priority in dataContext.IssuePriority) {
                result.Add(
                    key: priority.Name,
                    value: issuesForProject.Where(i => i.PriorityId == priority.Id).Count()
                );
            }

            return result;
        }

        public async Task<Dictionary<string, int>> GetNumberOfTasksPerIssueStatusInProject(int projectId) {
            var issuesForProject = await (
                from issue in dataContext.Issues
                join issueGroup in dataContext.IssueGroups on issue.GroupId equals issueGroup.Id
                where issueGroup.ProjectId == projectId
                select issue
            ).ToListAsync();

            Dictionary<string, int> result = new Dictionary<string, int>();
            foreach (var status in dataContext.IssueStatuses) {
                result.Add(
                    key: status.Name,
                    value: issuesForProject.Where(i => i.StatusId== status.Id).Count()
                );
            }

            return result;
        }

        public async Task<Dictionary<string, int>> GetNumberOfTasksPerGroupInProject(int projectId) {
            var issuesForProject = await (
                from issue in dataContext.Issues
                join issueGroup in dataContext.IssueGroups on issue.GroupId equals issueGroup.Id
                where issueGroup.ProjectId == projectId
                select issue
            ).ToListAsync();

            Dictionary<string, int> result = new Dictionary<string, int>();
            var groupsOnProject = await issueGroupRepository.GetGroupsAsync(projectId);
            foreach (var group in groupsOnProject) {
                result.Add(
                    key: group.Name,
                    value: issuesForProject.Where(i => i.GroupId == group.Id).Count()
                );
            }

            return result;
        }
    }
}
