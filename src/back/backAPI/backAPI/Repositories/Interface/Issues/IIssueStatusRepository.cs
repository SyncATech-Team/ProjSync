using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface.Issues
{
    public interface IIssueStatusRepository
    {
        Task<IssueStatus> GetTaskTypeByName(string name);
        Task<IssueStatus> GetTaskTypeById(int id);
    }
}
