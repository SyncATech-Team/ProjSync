using backAPI.DTO.Issues;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using backAPI.Repositories.Interface.Projects;
using backAPI.Repositories.Interface.Issues;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using backAPI.SignalR;

namespace backAPI.Controllers
{
    public class IssuesController : BaseApiController 
    {

        private readonly IIssueRepository _issueRepository;
        private readonly IProjectsRepository _projectsRepository;
        private readonly IIssueTypeRepository _issueTypeRepository;
        private readonly IIssueStatusRepository _issueStatusRepository;
        private readonly IUsersRepository _usersRepository;
        private readonly IIssuePriorityRepository _issuePriorityRepository;
        private readonly IIssueGroupRepository _issueGroupRepository;
        private readonly IUserOnIssueRepository _userOnIssueRepository;
        private readonly IssueNotificationService _issueNotificationService;
        private readonly INotificationsRepository _notificationsRepository;

        /* ***************************************************************************************************
         * Konstruktor
         * *************************************************************************************************** */
        public IssuesController(
            IIssueRepository issueRepository,
            IProjectsRepository projectsRepository, 
            IIssueTypeRepository issueTypeRepository,
            IIssueStatusRepository issueStatusRepository, 
            IUsersRepository usersRepository,
            IIssuePriorityRepository issuePriorityRepository,
            IIssueGroupRepository issueGroupRepository,
            IUserOnIssueRepository userOnIssueRepository,
            IssueNotificationService issueNotificationService,
            INotificationsRepository notificationsRepository
            ) {
                _issueRepository = issueRepository;
                _projectsRepository = projectsRepository;
                _issueTypeRepository = issueTypeRepository;
                _issueStatusRepository = issueStatusRepository;
                _usersRepository = usersRepository;
                _issuePriorityRepository = issuePriorityRepository;
                _issueGroupRepository = issueGroupRepository;
                _userOnIssueRepository = userOnIssueRepository;
                _issueNotificationService = issueNotificationService;
                _notificationsRepository = notificationsRepository;
        }

        [HttpGet("issueId")]
        public async Task<ActionResult<IssueDto>> GetIssueById(int issueId)
        {
            var issue = await _issueRepository.GetIssueById(issueId);

            var issueType = await _issueTypeRepository.GetIssueTypeById(issue.TypeId);
            var issuePriority = await _issuePriorityRepository.GetIssuePriorityById(issue.PriorityId);
            var issueStatus = await _issueStatusRepository.GetIssueStatusById(issue.StatusId);
            var issueGroup = await _issueGroupRepository.GetGroupAsync(issue.GroupId);
            var issueOwner = await _usersRepository.GetUserById(issue.OwnerId);
            var reporterId = await _issueRepository.GetReporterId(issue.Id);
            var reporterUsername = await _usersRepository.GetUserById(reporterId);
            var assigneeIds = await _issueRepository.GetAssigneeIds(issue.Id);
            var project = await _projectsRepository.GetProjectById(issueGroup.ProjectId);
            var issueDependencies = await _issueRepository.GetDependentIssues(issue.Id);
            List<string> assigneeUsernames = new List<string>();
            foreach (var assignee in assigneeIds)
            {
                var user = await _usersRepository.GetUserById(assignee);
                assigneeUsernames.Add(user.UserName);
            }

            IssueDto issueDto = new IssueDto
            {
                Id = issue.Id,
                Name = issue.Name,
                TypeName = issueType.Name,
                StatusName = issueStatus.Name,
                PriorityName = issuePriority.Name,
                Description = issue.Description,
                CreatedDate = issue.CreatedDate,
                UpdatedDate = issue.UpdatedDate,
                DueDate = issue.DueDate,
                OwnerUsername = issueOwner.UserName,
                ProjectName = project.Name,
                GroupName = issueGroup.Name,
                ReporterUsername = reporterUsername.UserName,
                AssigneeUsernames = assigneeUsernames.ToArray(),
                DependentOnIssues = issueDependencies.ToArray(),
                Completed = issue.Completed,
                GroupId = issueGroup.Id

            };
            
            return issueDto;
        }

        [HttpGet("groupId")]
        public async Task<ActionResult<IEnumerable<IssueDto>>> GetIssuesFromGroupAsync(int groupId) 
        {
            var issues = await _issueRepository.GetAllIssuesForGivenGroup( groupId );
            List<IssueDto> result = new List<IssueDto>();

            foreach( var issue in issues )
            {
                var issueType = await _issueTypeRepository.GetIssueTypeById(issue.TypeId);
                var issuePriority = await _issuePriorityRepository.GetIssuePriorityById(issue.PriorityId);
                var issueStatus = await _issueStatusRepository.GetIssueStatusById(issue.StatusId);
                var issueGroup = await _issueGroupRepository.GetGroupAsync(issue.GroupId);
                var issueOwner = await _usersRepository.GetUserById(issue.OwnerId);
                var reporterId = await _issueRepository.GetReporterId(issue.Id);
                var reporterUsername = await _usersRepository.GetUserById(reporterId);
                var assigneeIds = await _issueRepository.GetAssigneeIds(issue.Id);
                var project = await _projectsRepository.GetProjectById(issueGroup.ProjectId);
                var issueDependencies = await _issueRepository.GetDependentIssues(issue.Id);
                Console.WriteLine(issueDependencies);

                List<string> assigneeUsernames = new List<string>();
                foreach( var assignee in assigneeIds ) {
                    var user = await _usersRepository.GetUserById(assignee);
                    assigneeUsernames.Add(user.UserName);
                }

                IssueDto issueDto = new IssueDto
                {
                    Id = issue.Id,
                    Name = issue.Name,
                    TypeName = issueType.Name,
                    StatusName = issueStatus.Name,
                    PriorityName = issuePriority.Name,
                    Description = issue.Description,
                    CreatedDate = issue.CreatedDate,
                    UpdatedDate = issue.UpdatedDate,
                    DueDate = issue.DueDate,
                    OwnerUsername = issueOwner.UserName,
                    ProjectName = project.Name,
                    GroupName = issueGroup.Name,
                    ReporterUsername = reporterUsername.UserName,
                    AssigneeUsernames = assigneeUsernames.ToArray(),
                    DependentOnIssues = issueDependencies.ToArray(),
                    Completed = issue.Completed,
                    GroupId = issueGroup.Id
                };
                result.Add(issueDto);
            }

            return Ok(result);
        }

        [HttpGet("projectName")]
        public async Task<ActionResult<IEnumerable<IssueDto>>> GetAllIssuesForProject(string projectName)
        {
            var projectByName = await _projectsRepository.GetProjectByName(projectName);
            var groups = await _issueRepository.GetAllGroupsForGivenProject(projectByName.Id);
            List<IssueDto> result = new List<IssueDto>();

            foreach (var group in groups)
            {
                var issues = await _issueRepository.GetAllIssuesForGivenGroup(group.Id);

                foreach (var issue in issues) {
                    var issueType = await _issueTypeRepository.GetIssueTypeById(issue.TypeId);
                    var issuePriority = await _issuePriorityRepository.GetIssuePriorityById(issue.StatusId);
                    var issueStatus = await _issueStatusRepository.GetIssueStatusById(issue.StatusId);
                    var issueGroup = await _issueGroupRepository.GetGroupAsync(issue.GroupId);
                    var issueOwner = await _usersRepository.GetUserById(issue.OwnerId);
                    var reporterId = await _issueRepository.GetReporterId(issue.Id);
                    var reporterUsername = await _usersRepository.GetUserById(reporterId);
                    var assigneeIds = await _issueRepository.GetAssigneeIds(issue.Id);
                    var project = projectByName;
                    var issueDependencies = await _issueRepository.GetDependentIssues(issue.Id);

                    List<string> assigneeUsernames = new List<string>();
                    foreach (var assignee in assigneeIds) {
                        var user = await _usersRepository.GetUserById(assignee);
                        assigneeUsernames.Add(user.UserName);
                    }

                    IssueDto issueDto = new IssueDto {
                        Id = issue.Id,
                        Name = issue.Name,
                        TypeName = issueType.Name,
                        StatusName = issueStatus.Name,
                        PriorityName = issuePriority.Name,
                        Description = issue.Description,
                        CreatedDate = issue.CreatedDate,
                        UpdatedDate = issue.UpdatedDate,
                        DueDate = issue.DueDate,
                        OwnerUsername = issueOwner.UserName,
                        ProjectName = project.Name,
                        GroupName = issueGroup.Name,
                        ReporterUsername = reporterUsername.UserName,
                        AssigneeUsernames = assigneeUsernames.ToArray(),
                        DependentOnIssues = issueDependencies.ToArray(),
                        Completed = issue.Completed,
                        GroupId = issue.GroupId
                    };
                    result.Add(issueDto);
                }
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult> CreateIssueInsideGroup(IssueCreationDto creationModel) 
        {
            var issueName = creationModel.Name;
            var issueType = await _issueTypeRepository.GetIssueTypeByName(creationModel.TypeName);
            var issueStatus = await _issueStatusRepository.GetIssueStatusByName(creationModel.StatusName);
            var issuePriority = await _issuePriorityRepository.GetIssuePriorityByName(creationModel.PriorityName);
            var issueDescription = creationModel.Description != null ? creationModel.Description : "";
            var issueCreatedDate = creationModel.CreatedDate;
            var issueUpdatedDate = creationModel.UpdatedDate;
            var issueDueDate = creationModel.DueDate;
            var issueOwner = await _usersRepository.GetUserByUsername(creationModel.OwnerUsername);
            var project = await _projectsRepository.GetProjectByName(creationModel.ProjectName);
            var issueGroup = await _issueGroupRepository.GetGroupByNameAsync(project.Id, creationModel.GroupName);
            var completed = 0.0;

            var issueReporter = await _usersRepository.GetUserByUsername(creationModel.ReporterUsername);

            // Prevodjenje username - ova iz niza assignees u njihove id-jeve
            var assignedToIds = await _usersRepository.GetUsersFromIDarray(creationModel.AssigneeUsernames);
            
            if(issueCreatedDate < project.CreationDate)
            {
                return BadRequest(new { message = "A task cannot be created because its creation date is before the project creation date" });
            }

            var created = await _issueRepository.CreateIssueAsync(
                new Issue {
                    Name = issueName,
                    TypeId = issueType.Id,
                    StatusId = issueStatus.Id,
                    PriorityId = issuePriority.Id,
                    Description = issueDescription,
                    CreatedDate = issueCreatedDate,
                    UpdatedDate = issueUpdatedDate,
                    DueDate = issueDueDate,
                    OwnerId = issueOwner.Id,
                    GroupId = issueGroup.Id,
                    Completed = completed
                }
            );

            if (created == null) 
            {
                return BadRequest("There is already a task with the same name in this group");
            }

            List<UsersOnIssue> usersToInsert = new List<UsersOnIssue>();
            List<string> usernames = new List<string>();

            usersToInsert.Add(new UsersOnIssue
            {
                UserId = issueReporter.Id,
                IssueId = created.Id,
                Reporting = true,
                CompletionLevel = 0.0
            });
            usernames.Add(issueReporter.UserName);

            foreach (var assigneeId in assignedToIds)
            {

                usersToInsert.Add(new UsersOnIssue
                {
                    UserId = assigneeId.Id,
                    IssueId = created.Id,
                    Reporting = false,
                    CompletionLevel = 0.0
                });
                usernames.Add(assigneeId.UserName);
            }

            await _userOnIssueRepository.AddUserOnIssue(usersToInsert);

            // posalji norifikaciju da je kreiran zadatak
            await _issueNotificationService.NotifyUsersOnIssue(usernames.ToArray(), created.Name);

            // dodaj notifikacije u tabelu Notifications
            // [Id] [UserId] [Message] [DateCreated]
            List<Notification> notifications = new List<Notification>();
            foreach(var user in usersToInsert) {

                string messageContent = "" +
                    "<h4>🆕 You have been assigned a new task</h4>" +
                    "<span style='background: red;'><strong>Due Date: </strong>" + created.DueDate.ToLongDateString() + "</span>" + 
                    "<br>" +
                    "<strong>Project: </strong>" + project.Name +
                    "<br>" +
                    "<strong>Group: </strong>" + issueGroup.Name +
                    "<br>" + 
                    "<strong>Task Name: </strong>" + created.Name +
                    "<br>" +
                    "<strong>Assignee/Reporter: </strong>";
                if(user.Reporting) {
                    messageContent += "Reporter";
                }
                else {
                    messageContent += "Assignee";
                }
                
                notifications.Add(new Notification {
                    UserId = user.UserId,
                    Message = messageContent,
                    DateCreated = created.UpdatedDate
                });
            }
            await _notificationsRepository.AddNotificationRangeAsync(notifications);

            List<Tuple<int, int>> dependenciesToInsert = new List<Tuple<int, int>>();
            if(creationModel.DependentOnIssues != null) {
                foreach (var dependentOnIssueId in creationModel.DependentOnIssues) {
                    Tuple<int, int> e = new Tuple<int, int>(created.Id, dependentOnIssueId);
                    dependenciesToInsert.Add(e);
                }


            }

            return Ok();
        }

        [HttpPut("issueId")]
        public async Task<IActionResult> UpdateIssueStartEndDate(int issueId, IssueUpdateDatesDto updateDate) {
            var updated = await _issueRepository.UpdateIssueStartEndDate(issueId, updateDate);
            if(updated == false) {
                return BadRequest("Not valid call");
            }
            return Ok();
        }

        [HttpPut("kb/{issueId}")]
        public async Task<IActionResult> UpdateIssue(int issueId, JIssueDto bodyRequest)
        {
            var updated = await _issueRepository.UpdateIssue(issueId, bodyRequest);
            if (updated == false)
            {
                return BadRequest("Not valid call");
            }
            return Ok();
        }


        /// <summary>
        /// Endpoint koji upisuje novog korisnika na issue
        /// </summary>
        /// <param name="issueId"></param>
        /// <param name="bodyRequest"></param>
        /// <returns> novi completed nivo na celom zadatku </returns>
        [HttpPost("update-uoi/{issueId}")]
        public async Task<IActionResult> UpdateUsersOnIssue(int issueId, UsersOnIssueDto bodyRequest)
        {
            var updated = await _issueRepository.UpdateUsersOnIssue(issueId, bodyRequest);
            if (updated < 0)
            {
                return BadRequest("Not valid call");
            }
            return Ok(updated);
        }

        [HttpPut("update-cl/{issueId}")]
        public async Task<IActionResult> UpdateAssigneeCompletionLevel(int issueId, UsersOnIssueDto usersOnIssueDto)
        {
            var updated = await _issueRepository.UpdateAssigneeCompletionLevel(issueId, usersOnIssueDto);
            if (updated < 0)
            {
                return BadRequest("Not valid call");
            }
            return Ok(updated);
        }

        [HttpDelete("delete-uoi/{issueId}/{userId}")]
        public async Task<IActionResult> UpdateUsersOnIssue(int issueId, string userId)
        {
            var updated = await _issueRepository.DeleteUserOnIssue(issueId, userId);
            if (updated < 0)
            {
                return BadRequest("Not valid call");
            }
            return Ok(updated);
        }

        [HttpPut]
        public async Task<IActionResult> CreateOrDeleteDependency(IssueDependenciesUpdateDto model) {
            var changed = await _issueRepository.CreateOrDeleteDependency(model);
            return Ok();
        }
    }
}
