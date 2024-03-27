using backAPI.DTO.Projects;
using backAPI.Repositories.Interface.Projects;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
    public class ProjectTypesController : BaseApiController
    {
        private readonly IProjectTypesRepository _projectTypesRepository;

        public ProjectTypesController(IProjectTypesRepository projectTypesRepository)
        {
            _projectTypesRepository = projectTypesRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectTypeDto>>> GetAllProjectTypes()
        {
            var projectTypes = await _projectTypesRepository.GetProjectTypesAsync();
            List<ProjectTypeDto> result = new List<ProjectTypeDto>();
            foreach (var projectType in projectTypes) 
            { 
                result.Add(new ProjectTypeDto
                {
                    Id = projectType.Id,
                    Name = projectType.Name
                });
            }
            return result;
        }
    }
}
