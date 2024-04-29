using backAPI.Data;
using backAPI.DTO.Issues;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface.Issues;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation.Issues
{
    public class IssueCommentRepository : IIssueCommentRepository
    {

        private readonly DataContext _dataContext;

        public IssueCommentRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<bool> CreateCommentsOnIssue(JCommentDto model)
        {
            IssueComment ic = new IssueComment
            {
                Id = (int)model.Id,
                UserId = Int32.Parse(model.UserId),
                IssueId = Int32.Parse(model.IssueId),
                Content = model.Body,
                Created = DateTime.Parse(model.CreatedAt)
            };

            await _dataContext.IssueComments.AddAsync(ic);
            await _dataContext.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<IssueComment>> GetCommentsForIssue(int issueId)
        {
            List<IssueComment> comments = await _dataContext.IssueComments.Where(comment => comment.IssueId == issueId).ToListAsync();
            return comments.OrderBy(x => x.Created).ToList();
        }
    }
}
