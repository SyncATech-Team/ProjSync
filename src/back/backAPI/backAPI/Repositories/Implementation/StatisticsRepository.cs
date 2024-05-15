using backAPI.Data;
using backAPI.Repositories.Implementation.Issues;
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

        private async Task<Tuple<double, double>> CalculateGroupProgress(int groupId )
        {
            var issuesForGroup = await (
                from issue in dataContext.Issues
                join issueGroup in dataContext.IssueGroups on issue.GroupId equals issueGroup.Id
                where issue.GroupId == groupId
                select issue
            ).ToListAsync();

            if(issuesForGroup.Any() == false)
            {
                return Tuple.Create(0.0, 0.0);
            }

            double totalDays = 0;
            double totalProgress = 0;

            bool flag = false;
            DateTime minDate = new DateTime();
            DateTime maxDate = new DateTime();

            foreach (var issue in issuesForGroup)
            {
                Console.WriteLine(issue.CreatedDate + " - " + issue.DueDate);
                var dateDiff = issue.DueDate - issue.CreatedDate;
                double days = dateDiff.TotalDays;

                Console.WriteLine("Days: " + days);
                if (days == 0)
                {
                    days = 1;
                }

                totalDays += days;
                totalProgress += issue.Completed / 100 * days;

                if(flag == false)
                {
                    minDate = issue.CreatedDate;
                    maxDate = issue.DueDate;
                    flag = true;
                }
                else
                {
                    if(issue.CreatedDate < minDate)
                    {
                        minDate = issue.CreatedDate;
                    }
                    
                    if(issue.DueDate > maxDate)
                    {
                        maxDate = issue.DueDate;
                    }
                }
            }

            var dateDiff2 = maxDate - minDate;
            double differenceInDays = dateDiff2.TotalDays;
            if (totalDays == 0)
            {
                totalDays = 1;
            }
            if (differenceInDays == 0)
            {
                differenceInDays = 1;
            }
            return Tuple.Create(totalProgress / totalDays, differenceInDays);
        }

        public async Task<double> CalculateProjectProgress(int projectId)
        {
            var groups = await issueGroupRepository.GetGroupsAsync(projectId);

            if(groups.Any() == false)
            {
                return 0;
            }

            double totalProgress = 0;
            double totalDays = 0;

            foreach(var group in groups)
            {
                var progress = await CalculateGroupProgress(group.Id);
                totalProgress += progress.Item1 * progress.Item2;
                totalDays += progress.Item2;
            }

            if (totalDays == 0)
            {
                totalDays = 1;
            }

            return totalProgress / totalDays;
        }
    }
}
