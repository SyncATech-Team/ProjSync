using backAPI.Repositories.Interface.Issues;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
    public class IssuesStatusController : BaseApiController
    {
        private readonly IIssueStatusRepository _issueStatusRepository;

        public IssuesStatusController(IIssueStatusRepository issueStatusRepository)
        {
            _issueStatusRepository = issueStatusRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllIssueStatus()
        {
            var issueStatus = await _issueStatusRepository.GetAllIssueStatus();

            if (issueStatus == null || issueStatus.Count == 0)
            {
                return BadRequest("No issue types");
            }

            return Ok(issueStatus);
        }
    }
}
