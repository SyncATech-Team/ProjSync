using backAPI.DTO.Issues;
using backAPI.Entities.Domain;
using backAPI.Other.Helpers;

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
        Task<bool> UpdateAssigneeCompletionLevel(int issueId, UsersOnIssueDto usersOnIssueDto);

        Task<int> GetReporterId(int issueId);

        Task<IEnumerable<int>> GetDependentIssues(int issueId);

        Task<bool> AddIssueDependencies(IEnumerable<Tuple<int, int>> dependencies);
        Task<bool> UpdateIssueStartEndDate(int issueId, IssueUpdateDatesDto model);
        Task<bool> UpdateIssue(int issueId, JIssueDto model);
        Task<bool> UpdateUsersOnIssue(int issueId, JIssueDto model);
        Task<bool> CreateOrDeleteDependency(IssueDependenciesUpdateDto model);
        Task<(IEnumerable<Issue> issues, int numberOfRecords)> GetPaginationIssuesForProject(int projectId,Criteria criteria);
    }
}
