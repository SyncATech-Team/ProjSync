namespace backAPI.Repositories.Interface {
    public interface IStatisticsRepository {

        Task<Dictionary<string, int>> GetNumberOfTasksPerIssueTypeInProject(int projectId);

    }
}
