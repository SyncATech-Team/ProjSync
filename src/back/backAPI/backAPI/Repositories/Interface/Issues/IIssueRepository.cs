using backAPI.DTO.Issues;
using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface.Issues
{
    public interface IIssueRepository
    {
        /// <summary>
        /// Funkcija koja dohvata sve zadatke u odredjenoj grupi
        /// </summary>
        /// <param name="groupId"></param>
        /// <returns></returns>
        Task<Issue> GetIssueById(int issueId);
        Task<IEnumerable<Issue>> GetAllIssuesForGivenGroup(int groupId);
        /// <summary>
        /// Funkcija za kreiranje novog zadatka
        /// </summary>
        /// <param name="task"></param>
        /// <returns></returns>
        Task<Issue> CreateIssueAsync(Issue task);

        Task<IEnumerable<IssueGroup>> GetAllGroupsForGivenProject(int projectId);

        Task<IEnumerable<int>> GetAssigneeIds(int issueId);
        Task<IEnumerable<UsersOnIssueDto>> GetAssigneeCompletionLevel(int issueId);
        Task<double> UpdateAssigneeCompletionLevel(int issueId, UsersOnIssueDto usersOnIssueDto);
        Task<double> DeleteUserOnIssue(int issueId, string userId);
        Task<int> GetReporterId(int issueId);

        Task<IEnumerable<int>> GetDependentIssues(int issueId);

        Task<bool> AddIssueDependencies(IEnumerable<Tuple<int, int>> dependencies);
        Task<bool> UpdateIssueStartEndDate(int issueId, IssueUpdateDatesDto model);
        Task<bool> UpdateIssue(int issueId, JIssueDto model);
        Task<double> UpdateUsersOnIssue(int issueId, UsersOnIssueDto model);
        Task<bool> CreateOrDeleteDependency(IssueDependenciesUpdateDto model);
    }
}
