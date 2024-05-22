using backAPI.Entities.Domain;
using backAPI.Repositories.Interface.Issues;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
    [Authorize]
    public class IssuesPriorityController : BaseApiController
    {
        private readonly IIssuePriorityRepository _issuePriorityRepository;
        public IssuesPriorityController(IIssuePriorityRepository issuePriorityRepository) {
            _issuePriorityRepository = issuePriorityRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllIssuePrioritys()
        {
            var issuePriorityes = await _issuePriorityRepository.GetAllIssuePrioritys();

            if (issuePriorityes == null || issuePriorityes.Count == 0)
            {
                return BadRequest("No issue types");
            }

            return Ok(issuePriorityes);
        }
    }
}
