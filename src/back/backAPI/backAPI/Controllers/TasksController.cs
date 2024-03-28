using backAPI.DTO.Tasks;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using backAPI.Repositories.Interface.Projects;
using backAPI.Repositories.Interface.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
    public class TasksController : BaseApiController {

        private readonly ITasksRepository _tasksRepository;
        private readonly IProjectsRepository _projectsRepository;
        private readonly ITaskTypeRepository _taskTypeRepository;
        private readonly ITaskStatusRepository _taskStatusRepository;
        private readonly IUsersRepository _usersRepository;
        private readonly ITaskPriorityRepository _taskPriorityRepository;
        private readonly ITaskGroupRepository _taskGroupRepository;

        /* ***************************************************************************************************
         * Konstruktor
         * *************************************************************************************************** */
        public TasksController(
            ITasksRepository tasksRepository,
            IProjectsRepository projectsRepository, 
            ITaskTypeRepository taskTypeRepository,
            ITaskStatusRepository taskStatusRepository, 
            IUsersRepository usersRepository,
            ITaskPriorityRepository taskPriorityRepository,
            ITaskGroupRepository taskGroupRepository
            ) {
                _tasksRepository = tasksRepository;
                _projectsRepository = projectsRepository;
                _taskTypeRepository = taskTypeRepository;
                _taskStatusRepository = taskStatusRepository;
                _usersRepository = usersRepository;
                _taskPriorityRepository = taskPriorityRepository;
                _taskGroupRepository = taskGroupRepository;
        }

        [HttpGet("groupId")]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasksFromGroupAsync(int groupId) {
            var tasks = await _tasksRepository.GetAllTasksForGivenGroup( groupId );
            List<TaskDto> result = new List<TaskDto>();

            foreach( var task in tasks )
            {
                var ttype = await _taskTypeRepository.GetTaskTypeById(task.TypeId);
                var tpriority = await _taskPriorityRepository.GetTaskPriorityById(task.StatusId);
                var tstatus = await _taskStatusRepository.GetTaskTypeById(task.StatusId);
                var taskGroup = await _taskGroupRepository.GetGroupAsync(task.Id);
                TaskDto taskDto = new()
                {
                    Name = task.Name,
                    TypeName = ttype.Name,
                    StatusName = tstatus.Name,
                    PriorityName = tpriority.Name,
                    Description = task.Description,
                    CreatedDate = task.CreatedDate,
                    UpdatedDate = task.UpdatedDate,
                    DueDate = task.DueDate,
                    GroupName = taskGroup.Name,
                    DependentOn = task.DependentOn
                };
                result.Add(taskDto);
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult> CreateTaskInsideGroup(TaskDto task) {

            var ttype = await _taskTypeRepository.GetTaskTypeByName(task.TypeName);
            var tstatus = await _taskStatusRepository.GetTaskTypeByName(task.StatusName);
            var treporter = await _usersRepository.UsernameToId(task.ReporterUsername);
            var tpriority = await _taskPriorityRepository.GetTaskPriorityByName(task.PriorityName);
            var project = await _projectsRepository.GetProjectByName(task.ProjectName);
            var taskGroup = await _taskGroupRepository.GetGroupByNameAsync(project.Id, task.GroupName);

        var created = await _tasksRepository.CreateTaskAsync(new Issue {
                Name = task.Name,
                TypeId = ttype.Id,
                StatusId = tstatus.Id,
                PriorityId = tpriority.Id,
                Description = task.Description,
                CreatedDate = task.CreatedDate,
                UpdatedDate = task.UpdatedDate,
                DueDate = task.DueDate,
                ReporterId = treporter,
                DependentOn = task.DependentOn == -1 ? null : task.DependentOn,
                GroupId = taskGroup.Id
            });

            if (created == null) {
                return BadRequest("There is already a task with the same name in this group");
            }

            return Ok();
        }
    }
}
