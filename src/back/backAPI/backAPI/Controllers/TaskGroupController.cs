using backAPI.DTO;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers {
    public class TaskGroupController : BaseApiController {
    
        private readonly ITaskGroupRepository _taskGroupRepository;
        private readonly IProjectsRepository _projectsRepository;

        public TaskGroupController(ITaskGroupRepository taskGroupRepository, IProjectsRepository projectsRepository) { 
            _taskGroupRepository = taskGroupRepository;
            _projectsRepository = projectsRepository;
        }

        /* ******************************************************************************
         * Get all groups on a project
         * ****************************************************************************** */
        [HttpGet("projectName")]
        public async Task<ActionResult<IEnumerable<TaskGroupCreateDto>>> GetGroupsForProject(string projectName) {
            var project = _projectsRepository.GetProjectByName(projectName).Result;
            if(project  == null) {
                return BadRequest("No project with the given name");
            }
            var groups = await _taskGroupRepository.GetGroupsAsync(project.Id);

            List<TaskGroupCreateDto> result = new List<TaskGroupCreateDto>();

            foreach (var group in groups) {
                result.Add(new TaskGroupCreateDto {
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
        public async Task<ActionResult> CreateGroupOnProject(string projectName, TaskGroupCreateDto group) {

            var project = _projectsRepository.GetProjectByName(projectName).Result;
            if(project == null) {
                return BadRequest("No project with the given name");
            }

            var nameExists = _taskGroupRepository.GroupNameExistsWithinTheSameProject(project.Id, group.Name);
            if(nameExists == true) {
                return BadRequest("There is already a group with the same name in this project");
            }

            await _taskGroupRepository.CreateGroupAsync(new TaskGroup {
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
