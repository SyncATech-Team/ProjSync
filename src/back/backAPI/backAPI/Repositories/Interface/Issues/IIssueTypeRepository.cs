using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface.Issues
{
    public interface IIssueTypeRepository
    {
        Task<IssueType> GetIssueTypeByName(string name);
        Task<IssueType> GetIssueTypeById(int id);
        Task <List<IssueType>> GetAllIssueTypes();
    }
}
