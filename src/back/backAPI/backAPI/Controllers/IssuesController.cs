using backAPI.DTO.Issues;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using backAPI.Repositories.Interface.Projects;
using backAPI.Repositories.Interface.Issues;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using System.Text.RegularExpressions;

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
            IUserOnIssueRepository userOnIssueRepository
            ) {
                _issueRepository = issueRepository;
                _projectsRepository = projectsRepository;
                _issueTypeRepository = issueTypeRepository;
                _issueStatusRepository = issueStatusRepository;
                _usersRepository = usersRepository;
                _issuePriorityRepository = issuePriorityRepository;
                _issueGroupRepository = issueGroupRepository;
                _userOnIssueRepository = userOnIssueRepository;
        }

        [HttpGet("groupId")]
        public async Task<ActionResult<IEnumerable<IssueDto>>> GetIssuesFromGroupAsync(int groupId) 
        {
            var issues = await _issueRepository.GetAllIssuesForGivenGroup( groupId );
            List<IssueDto> result = new List<IssueDto>();

            foreach( var issue in issues )
            {
                var issueType = await _issueTypeRepository.GetIssueTypeById(issue.TypeId);
                var issuePriority = await _issuePriorityRepository.GetIssuePriorityById(issue.StatusId);
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
                    Completed = issue.Completed
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
                        Completed = issue.Completed
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

            Console.BackgroundColor = ConsoleColor.Blue;
            Console.WriteLine("Creating issue...");
            Console.WriteLine(issueName + "\n" 
                + issueType + "\n" 
                + issueStatus + "\n"
                + issuePriority + "\n"
                + issueDescription + "\n"
                + issueCreatedDate + "\n"
                + issueUpdatedDate + "\n"
                + issueDueDate + "\n"
                + issueOwner + "\n"
                + project.Name + "\n"
                + issueGroup.Name + "\n");
            Console.WriteLine(issueReporter.UserName);
            Console.BackgroundColor = ConsoleColor.Black;

            // Prevodjenje username - ova iz niza assignees u njihove id-jeve
            var assignedToIds = await _usersRepository.GetUsersFromIDarray(creationModel.AssigneeUsernames);

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

            usersToInsert.Add(new UsersOnIssue
            {
                UserId = issueReporter.Id,
                IssueId = created.Id,
                Reporting = true,
                CompletionLevel = 0.0
            });

            foreach (var assigneeId in assignedToIds)
            {

                usersToInsert.Add(new UsersOnIssue
                {
                    UserId = assigneeId.Id,
                    IssueId = created.Id,
                    Reporting = false,
                    CompletionLevel = 0.0
                });
            }

            await _userOnIssueRepository.AddUserOnIssue(usersToInsert);

            List<Tuple<int, int>> dependenciesToInsert = new List<Tuple<int, int>>();
            if(creationModel.DependentOnIssues != null) {
                foreach (var dependentOnIssueId in creationModel.DependentOnIssues) {
                    Tuple<int, int> e = new Tuple<int, int>(created.Id, dependentOnIssueId);
                    dependenciesToInsert.Add(e);
                }


            }

            return Ok();
        }
    }
}
