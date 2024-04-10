using backAPI.DTO.Projects;
using backAPI.Repositories.Interface.Projects;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
    public class ProjectVisibilitiesController : BaseApiController
    {
        private readonly IProjectVisibilitiesRepository _projectVisibilitiesRepository;

        public ProjectVisibilitiesController(IProjectVisibilitiesRepository projectVisibilitiesRepository)
        {
            _projectVisibilitiesRepository = projectVisibilitiesRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectVisibilityDto>>> GetAllProjectVisibilities()
        {
            var projectVisibilities = await _projectVisibilitiesRepository.GetProjectVisibilitiesAsync();
            List<ProjectVisibilityDto> result = new List<ProjectVisibilityDto>();
            foreach (var projectVisibility in projectVisibilities) {
                result.Add(new ProjectVisibilityDto 
                {
                    Id = projectVisibility.Id,
                    Name = projectVisibility.Name 
                });
            }
            return result;
        }
    }
}
