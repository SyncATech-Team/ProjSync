using backAPI.DTO;
using backAPI.Repositories.Interface;
using Microsoft.AspNetCore.Mvc;
using Task = backAPI.Entities.Domain.Task;

namespace backAPI.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : BaseApiController {

        private readonly ITasksRepository _tasksRepository;
        private readonly IProjectsRepository _projectsRepository;

        public TasksController(ITasksRepository tasksRepository, IProjectsRepository projectsRepository) {
            _tasksRepository = tasksRepository;
            _projectsRepository = projectsRepository;
        }

        [HttpGet("projectName")]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetAllTasksOnProject(string projectName) {
            var project = _projectsRepository.GetProjectByName(projectName).Result;
            if (project == null) {
                return BadRequest("No project with the given name");
            }

            List<TaskDto> result = new List<TaskDto>();
            var groupIds = await _projectsRepository.GetTaskGroupIds(project.Id);
            foreach (var groupId in groupIds) {
                var tasks = await _tasksRepository.GetAllTasksForGivenGroup(groupId);
                foreach (var task in tasks) {
                    result.Add(new TaskDto {
                        Id = task.Id,
                        Name = task.Name,
                        TypeId = task.TypeId,
                        StatusId = task.StatusId,
                        PriorityId = task.PriorityId,
                        Description = task.Description,
                        Estimate = task.Estimate,
                        TimeSpent = task.TimeSpent,
                        TimeRemaining = task.TimeRemaining,
                        CreatedDate = task.CreatedDate,
                        UpdatedDate = task.UpdatedDate,
                        DueDate = task.DueDate,
                        ReporterId = task.ReporterId,
                        GroupId = task.GroupId,
                        DependentOn = task.DependentOn
                    });
                }
            }

            return result;
        }

        [HttpGet("groupId")]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetAllTasksInGroup(int groupId) {
            List<TaskDto> result = new List<TaskDto>();
            
            var tasks = await _tasksRepository.GetAllTasksForGivenGroup(groupId);
            foreach (var task in tasks) {
                result.Add(new TaskDto {
                    Id = task.Id,
                    Name = task.Name,
                    TypeId = task.TypeId,
                    StatusId = task.StatusId,
                    PriorityId = task.PriorityId,
                    Description = task.Description,
                    Estimate = task.Estimate,
                    TimeSpent = task.TimeSpent,
                    TimeRemaining = task.TimeRemaining,
                    CreatedDate = task.CreatedDate,
                    UpdatedDate = task.UpdatedDate,
                    DueDate = task.DueDate,
                    ReporterId = task.ReporterId,
                    GroupId = task.GroupId,
                    DependentOn = task.DependentOn
                });
            }
            return result;
        }

        [HttpPost]
        public async Task<ActionResult> CreateTaskInsideGroup(string groupId, TaskDto task) {
            var created = await _tasksRepository.CreateTaskAsync(new Task {
                Id = task.Id,
                Name = task.Name,
                TypeId = task.TypeId,
                StatusId = task.StatusId,
                PriorityId = task.PriorityId,
                Description = task.Description,
                Estimate = task.Estimate,
                TimeSpent = task.TimeSpent,
                TimeRemaining = task.TimeRemaining,
                CreatedDate = task.CreatedDate,
                UpdatedDate = task.UpdatedDate,
                DueDate = task.DueDate,
                ReporterId = task.ReporterId,
                GroupId = task.GroupId,
                DependentOn = task.DependentOn
            });

            if (created == null) {
                return BadRequest("There is already a task with the same name in this group");
            }

            return Ok();
        }
    }
}
