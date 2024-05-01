﻿using backAPI.Data;
using backAPI.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation {
    public class StatisticsRepository : IStatisticsRepository {

        private readonly DataContext dataContext;

        public StatisticsRepository(DataContext dataContext) {
            this.dataContext = dataContext;
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


    }
}
