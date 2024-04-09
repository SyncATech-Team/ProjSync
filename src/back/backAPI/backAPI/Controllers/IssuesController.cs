using backAPI.DTO.Issues;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using backAPI.Repositories.Interface.Projects;
using backAPI.Repositories.Interface.Issues;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
    public class IssuesController : BaseApiController 
    {

        private readonly IIssueRepository _tasksRepository;
        private readonly IProjectsRepository _projectsRepository;
        private readonly IIssueTypeRepository _taskTypeRepository;
        private readonly IIssueStatusRepository _taskStatusRepository;
        private readonly IUsersRepository _usersRepository;
        private readonly IIssuePriorityRepository _taskPriorityRepository;
        private readonly IIssueGroupRepository _taskGroupRepository;

        /* ***************************************************************************************************
         * Konstruktor
         * *************************************************************************************************** */
        public IssuesController(
            IIssueRepository tasksRepository,
            IProjectsRepository projectsRepository, 
            IIssueTypeRepository taskTypeRepository,
            IIssueStatusRepository taskStatusRepository, 
            IUsersRepository usersRepository,
            IIssuePriorityRepository taskPriorityRepository,
            IIssueGroupRepository taskGroupRepository
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
        public async Task<ActionResult<IEnumerable<IssueDto>>> GetTasksFromGroupAsync(int groupId) 
        {
            var tasks = await _tasksRepository.GetAllTasksForGivenGroup( groupId );
            List<IssueDto> result = new List<IssueDto>();

            foreach( var task in tasks )
            {
                var ttype = await _taskTypeRepository.GetTaskTypeById(task.TypeId);
                var tpriority = await _taskPriorityRepository.GetTaskPriorityById(task.StatusId);
                var tstatus = await _taskStatusRepository.GetTaskTypeById(task.StatusId);
                var taskGroup = await _taskGroupRepository.GetGroupAsync(task.Id);
                IssueDto taskDto = new()
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
        public async Task<ActionResult> CreateTaskInsideGroup(IssueDto task) 
        {

            var ttype = await _taskTypeRepository.GetTaskTypeByName(task.TypeName);
            var tstatus = await _taskStatusRepository.GetTaskTypeByName(task.StatusName);
            var treporter = await _usersRepository.UsernameToId(task.ReporterUsername);
            var tpriority = await _taskPriorityRepository.GetTaskPriorityByName(task.PriorityName);
            var project = await _projectsRepository.GetProjectByName(task.ProjectName);
            var taskGroup = await _taskGroupRepository.GetGroupByNameAsync(project.Id, task.GroupName);

            List<int> assignedToIds = new List<int>();
            foreach (var username in task.AssignedTo)
            {
                var assignedToId = await _usersRepository.UsernameToId(username);
                assignedToIds.Add(assignedToId);
            }

            var created = await _tasksRepository.CreateTaskAsync(
            new Issue 
            {
                Name = task.Name,
                TypeId = ttype.Id,
                StatusId = tstatus.Id,
                PriorityId = tpriority.Id,
                Description = task.Description,
                CreatedDate = task.CreatedDate,
                UpdatedDate = task.UpdatedDate,
                DueDate = task.DueDate,
                ReporterId = treporter,
                AssigneeId = assignedToIds,
                DependentOn = task.DependentOn == -1 ? null : task.DependentOn,
                GroupId = taskGroup.Id
            });;

            if (created == null) 
            {
                return BadRequest("There is already a task with the same name in this group");
            }

            return Ok();
        }
    }
}
