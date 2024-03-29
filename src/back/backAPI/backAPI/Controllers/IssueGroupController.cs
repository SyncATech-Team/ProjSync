using backAPI.DTO.Issues;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface.Projects;
using backAPI.Repositories.Interface.Issues;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
    public class IssueGroupController : BaseApiController {
    
        private readonly IIssueGroupRepository _taskGroupRepository;
        private readonly IProjectsRepository _projectsRepository;

        public IssueGroupController(IIssueGroupRepository taskGroupRepository, IProjectsRepository projectsRepository) { 
            _taskGroupRepository = taskGroupRepository;
            _projectsRepository = projectsRepository;
        }

        /* ******************************************************************************
         * Get all groups on a project
         * ****************************************************************************** */
        [HttpGet("projectName")]
        public async Task<ActionResult<IEnumerable<IssueGroupResponseDto>>> GetGroupsForProject(string projectName) {
            var project = _projectsRepository.GetProjectByName(projectName).Result;
            if(project  == null) {
                return BadRequest("No project with the given name");
            }
            var groups = await _taskGroupRepository.GetGroupsAsync(project.Id);

            List<IssueGroupResponseDto> result = new List<IssueGroupResponseDto>();

            foreach (var group in groups) {
                result.Add(new IssueGroupResponseDto {
                    Id = group.Id,
                    Name = group.Name
                });
            }

            return result;
        }
        /* ******************************************************************************
         * Create new group on a project
         * ****************************************************************************** */
        [HttpPost]
        public async Task<ActionResult> CreateGroupOnProject(string projectName, IssueGroupCreateDto group) {

            var project = _projectsRepository.GetProjectByName(projectName).Result;
            if(project == null) {
                return BadRequest("No project with the given name");
            }

            var nameExists = await _taskGroupRepository.GroupNameExistsWithinTheSameProject(project.Id, group.Name);
            if(nameExists == true) {
                return BadRequest("There is already a group with the same name in this project");
            }

            await _taskGroupRepository.CreateGroupAsync(new IssueGroup {
                Name = group.Name,
                ProjectId = project.Id
            });

            return Ok();
        }
        /* ******************************************************************************
         * 
         * ****************************************************************************** */
    }
}
