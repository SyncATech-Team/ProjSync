using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface.Issues
{
    public interface IUserOnIssueRepository
    {
        Task<UsersOnIssue> AddUserOnIssue(UsersOnIssue userOnIssue);
        Task<bool> AddUserOnIssue(IEnumerable<UsersOnIssue> usersOnIssue);
        Task<IEnumerable<Issue>> UserIssuess(int userId);
    }
}
