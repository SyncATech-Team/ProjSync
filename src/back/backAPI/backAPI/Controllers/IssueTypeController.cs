using backAPI.DTO.Issues;
using backAPI.DTO.Projects;
using backAPI.Repositories.Interface.Issues;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
    public class IssueTypeController : BaseApiController
    {
        private readonly IIssueTypeRepository _issueTypeRepository;
        public IssueTypeController(IIssueTypeRepository issueTypeRepository) { 
            _issueTypeRepository = issueTypeRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllIssueTypes()
        {
            var issueTypes = await _issueTypeRepository.GetAllIssueTypes();

            if (issueTypes == null || issueTypes.Count == 0)
            {
                return BadRequest("No issue types");
            }

            return Ok(issueTypes);
        }
    }
}
