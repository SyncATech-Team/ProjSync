using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface.Issues
{
    public interface IIssueTypeRepository
    {
        Task<IssueType> GetTaskTypeByName(string name);
        Task<IssueType> GetTaskTypeById(int id);
    }
}
