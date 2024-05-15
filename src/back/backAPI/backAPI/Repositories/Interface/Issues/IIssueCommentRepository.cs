using backAPI.DTO.Issues;
using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface.Issues
{
    public interface IIssueCommentRepository
    {
        Task<bool> CreateCommentsOnIssue(JCommentDto model);
        Task<IEnumerable<IssueComment>> GetCommentsForIssue(int issueId);
    }
}
