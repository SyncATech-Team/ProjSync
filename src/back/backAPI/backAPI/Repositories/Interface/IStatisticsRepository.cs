namespace backAPI.Repositories.Interface {
    public interface IStatisticsRepository {

        Task<Dictionary<string, int>> GetNumberOfTasksPerIssueTypeInProject(int projectId);
        Task<Dictionary<string, int>> GetNumberOfTasksPerIssuePriorityProject(int projectId);
        Task<Dictionary<string, int>> GetNumberOfTasksPerIssueStatusInProject(int projectId);
        Task<Dictionary<string, int>> GetNumberOfTasksPerGroupInProject(int projectId);
        Task<double> CalculateProjectProgress(int projectId);
    }
}
