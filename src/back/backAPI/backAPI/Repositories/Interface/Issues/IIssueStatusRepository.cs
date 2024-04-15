using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface.Issues
{
    public interface IIssueStatusRepository
    {
        Task<IssueStatus> GetIssueStatusByName(string name);
        Task<IssueStatus> GetIssueStatusById(int id);

        Task<List<IssueStatus>> GetAllIssueStatus();
    }
}
