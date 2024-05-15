using backAPI.DTO.Issues;
using backAPI.Repositories.Interface.Issues;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
    public class IssuesCommentController : BaseApiController
    {
        private readonly IIssueCommentRepository _issueCommentRepository;

        public IssuesCommentController(IIssueCommentRepository issueCommentRepository)
        {
            _issueCommentRepository = issueCommentRepository;
        }

        [HttpPost]
        public async Task<IActionResult> CreateCommentOnIssue(JCommentDto comment)
        {
            var updated = await _issueCommentRepository.CreateCommentsOnIssue(comment);
            if (updated == false)
            {
                return BadRequest("Not valid call");
            }
            return Ok();
        }
    }
}
