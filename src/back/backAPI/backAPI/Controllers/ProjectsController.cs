using backAPI.DTO;
using backAPI.DTO.Issues;
using backAPI.DTO.Projects;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using backAPI.Repositories.Interface.Issues;
using backAPI.Repositories.Interface.Projects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
    [Authorize]
    public class ProjectsController : BaseApiController
    {
        private readonly IProjectsRepository _projectsRepository;
        private readonly IUsersRepository _usersRepository;
        private readonly IProjectTypesRepository _projectTypesRepository;
        private readonly IProjectVisibilitiesRepository _projectVisibilitiesRepository;
        private readonly IIssueRepository _issueRepository;
        private readonly IIssueTypeRepository _issueTypeRepository;
        private readonly IIssueStatusRepository _issueStatusRepository;
        private readonly IIssuePriorityRepository _issuePriorityRepository;
        private readonly IIssueGroupRepository _issueGroupRepository;
        private readonly IUserOnIssueRepository _userOnIssueRepository;
        private readonly IUserOnProjectRepository _userOnProjectRepository;
        private readonly IIssueCommentRepository _issueCommentRepository;
        private readonly IStatisticsRepository _statisticsRepository;

        public ProjectsController(IProjectsRepository projectsRepository, IUsersRepository usersRepository,
            IProjectTypesRepository projectTypesRepository, IProjectVisibilitiesRepository projectVisibilitiesRepository,
            IIssueRepository issueRepository,IIssueTypeRepository issueTypeRepository, IIssueStatusRepository issueStatusRepository,
            IIssuePriorityRepository issuePriorityRepository, IIssueGroupRepository issueGroupRepository, IUserOnIssueRepository userOnIssueRepository,
            IUserOnProjectRepository userOnProjectRepository, IIssueCommentRepository issueCommentRepository,
            IStatisticsRepository statisticsRepository)
        {
            _projectsRepository = projectsRepository;
            _usersRepository = usersRepository;
            _projectTypesRepository = projectTypesRepository;
            _projectVisibilitiesRepository = projectVisibilitiesRepository;
            _issueRepository = issueRepository;
            _issueTypeRepository = issueTypeRepository;
            _issueStatusRepository = issueStatusRepository;
            _issuePriorityRepository = issuePriorityRepository;
            _issueGroupRepository = issueGroupRepository;
            _userOnIssueRepository = userOnIssueRepository;
            _userOnProjectRepository = userOnProjectRepository;
            _issueCommentRepository = issueCommentRepository;
            _statisticsRepository = statisticsRepository;
        }
        /* ***************************************************************************************
         * Get all projects
         * *************************************************************************************** */
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDto>>> GetAllProjects()
        {
            var projects = await _projectsRepository.GetProjectsAsync();
            List<ProjectDto> result = new List<ProjectDto>();
            foreach (var project in projects)
            {
                var type = await _projectTypesRepository.GetProjectTypeById(project.TypeId);
                var visibility = await _projectVisibilitiesRepository.GetProjectVisibilityByIdAsync(project.VisibilityId);
                var owner = await _usersRepository.IdToUsername(project.OwnerId);

                Project parent = null;
                if(project.ParentId != null) {
                    parent = await _projectsRepository.GetProjectById((int)project.ParentId);
                }

                var parentName = (parent == null) ? "No parent" : parent.Name;

                var projectProgress = await _statisticsRepository.CalculateProjectProgress(project.Id);

                result.Add(new ProjectDto {
                    Name = project.Name,
                    Key = project.Key,
                    TypeName = type.Name,
                    Description = project.Description,
                    CreationDate = project.CreationDate,
                    Icon = project.IconPath,
                    DueDate = project.DueDate,
                    OwnerUsername = owner,
                    ParentProjectName = parentName,
                    Budget = project.Budget,
                    VisibilityName = visibility.Name,
                    ProjectProgress = projectProgress
                });
            }
            return result;
        }
        /* ***************************************************************************************
         * Get project by name
         * *************************************************************************************** */
        [HttpGet("{projectName}")]
        public async Task<ActionResult<ProjectDto>> GetProjectByName(string projectName) {
            var project = _projectsRepository.GetProjectByName(projectName);

            if(project.Result == null) {
                return NotFound("There is no project with specified name");
            }

            var type = await _projectTypesRepository.GetProjectTypeById(project.Result.TypeId);
            var visibility = await _projectVisibilitiesRepository.GetProjectVisibilityByIdAsync(project.Result.VisibilityId);
            var owner = await _usersRepository.IdToUsername(project.Result.OwnerId);

            return new ProjectDto {
                Name = project.Result.Name,
                Key = project.Result.Key,
                Description = project.Result.Description,
                TypeName = type.Name,
                OwnerUsername = owner,
                Icon = project.Result.IconPath,
                CreationDate = project.Result.CreationDate,
                DueDate = project.Result.DueDate,
                Budget = project.Result.Budget,
                VisibilityName = visibility.Name
            };
        }

        [HttpGet("user/{username}")]
        public async Task<IActionResult> GetProjectsForUser(string username)
        {
            var user = await _usersRepository.GetUserByUsername(username);
            List<ProjectDto> dTOProjects = new List<ProjectDto>();

            if (user == null)
            {
                return NotFound("There is no user with specified username");
            }

            var projects = await _projectsRepository.GetProjectsForUserAsync(username);


            foreach (var project in projects)
            {

                var projectProgress = await _statisticsRepository.CalculateProjectProgress(project.Id);
                
                dTOProjects.Add(new ProjectDto
                {
                    Name = project.Name,
                    Key = project.Key,
                    Description = project.Description,
                    TypeName = _projectTypesRepository.GetProjectTypeById(project.TypeId).Result.Name,
                    CreationDate = project.CreationDate,
                    Icon = project.IconPath,
                    DueDate = project.DueDate,
                    OwnerUsername = await _usersRepository.IdToUsername(project.OwnerId),
                    Budget = project.Budget,
                    VisibilityName = _projectVisibilitiesRepository.GetProjectVisibilityByIdAsync(project.VisibilityId).Result.Name,
                    ProjectProgress = projectProgress

                });
            }

            return Ok(dTOProjects);
        }

        /// <summary>
        /// Dohvatanje projekta sa svim zadacima, 
        /// zadaci sadrze i veze sa svojim prethodnicima i naslednicima
        /// </summary>
        /// <returns></returns>
        [HttpGet("{projectName}/all")]
        public async Task<ActionResult<IEnumerable<ProjectWithIssuesDto>>> GetProjectByNameWithIssues(string projectName)
        {
            var projectByName = await _projectsRepository.GetProjectByName(projectName);
            var groups = await _issueRepository.GetAllGroupsForGivenProject(projectByName.Id);


            ProjectWithIssuesDto result = new ProjectWithIssuesDto();
            var type = await _projectTypesRepository.GetProjectTypeById(projectByName.TypeId);
            result.Id = projectByName.Id.ToString();
            result.Name = projectName;
            result.Description = projectByName.Description;
            result.ProjectCategory = type.Name;
            result.CreatedAt = projectByName.CreationDate.ToString();

            List<JIssueDto> issues = new List<JIssueDto>();
            List<UserDto> users = new List<UserDto>();

            IEnumerable<User> usersOnProjects = await _userOnProjectRepository.GetUsersOnProjectAsync(projectName);
            // dohvatanje svih user-a na projektu
            foreach(var user in usersOnProjects)
            {
                UserDto userDto = new UserDto
                {
                    Id = user.Id.ToString(),
                    AvatarUrl = user.ProfilePhoto,
                    Name = user.FirstName + " " + user.LastName,
                    Username = user.UserName,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    ProfilePhoto = user.ProfilePhoto,
                    Address = user.Address,
                    ContactPhone = user.ContactPhone,
                    Status = user.Status,
                    IsVerified = user.IsVerified,
                    PreferedLanguage = user.PreferedLanguage,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt,
                    isActive = user.IsActive
                };

                users.Add(userDto);
            }

            List<IssueGroupResponseDto> groupsDTO = new List<IssueGroupResponseDto>();
            foreach (var group in groups)
            {
                var issuesInGroup = await _issueRepository.GetAllIssuesForGivenGroup(group.Id);

                // dodavanje group DTO za gant
                groupsDTO.Add(new IssueGroupResponseDto
                {
                    Id = group.Id,
                    Name = group.Name,
                });

                foreach (var issue in issuesInGroup)
                {
                    var issueType = await _issueTypeRepository.GetIssueTypeById(issue.TypeId);
                    var issuePriority = await _issuePriorityRepository.GetIssuePriorityById(issue.PriorityId);
                    var issueStatus = await _issueStatusRepository.GetIssueStatusById(issue.StatusId);
                    var assigneeIds = await _issueRepository.GetAssigneeIds(issue.Id);
                    var assigneeeCompletionLevel = await _issueRepository.GetAssigneeCompletionLevel(issue.Id);
                    var comments = await _issueCommentRepository.GetCommentsForIssue(issue.Id);
                    var issueGroup = await _issueGroupRepository.GetGroupAsync(issue.GroupId);
                    var issueOwner = await _usersRepository.GetUserById(issue.OwnerId);
                    var reporterId = await _issueRepository.GetReporterId(issue.Id);
                    var reporterUsername = await _usersRepository.GetUserById(reporterId);
                    var issueDependencies = await _issueRepository.GetDependentIssues(issue.Id);


                    var issuePredecessors = await _issueRepository.GetIssuePredecessors(issue.Id);
                    var issueSuccessors = await _issueRepository.GetIssueSuccessors(issue.Id);

                    var project = projectByName;
                    List<string> assigneeIdsList = new List<string>();
                    foreach (var assigneeId in assigneeIds)
                    {
                        assigneeIdsList.Add(assigneeId.ToString());
                    }

                    List<JCommentDto> commentDtos = new List<JCommentDto>();
                    List<string> assigneeUsernames = new List<string>();
                    foreach (var item in comments)
                    {
                        var user = await _usersRepository.GetUserById(item.UserId);
                        assigneeUsernames.Add(user.UserName);
                        var userDto = new UserDto()
                        {
                            Name = user.FirstName + ' ' + user.LastName,
                            Username = user.UserName
                        };

                        commentDtos.Add(new JCommentDto
                        {
                            Id = item.Id,
                            IssueId = item.IssueId.ToString(),
                            UserId = item.UserId.ToString(),
                            Body = item.Content,
                            CreatedAt = item.Created.ToString(),
                            UpdatedAt = item.Created.ToString(),
                            User = userDto
                        });
                    }

                    JIssueDto issueDto = new JIssueDto
                    {
                        Id = issue.Id.ToString(),
                        Title = issue.Name,
                        Type = issueType.Name,
                        Status = issueStatus.Name,
                        Priority = issuePriority.Name,
                        ListPosition = issue.ListPosition,
                        Description = issue.Description,
                        Estimate = 0,
                        TimeSpent = 0,
                        TimeRemaining = 0,
                        CreatedAt = issue.CreatedDate.ToString(),
                        UpdatedAt = issue.UpdatedDate.ToString(),
                        DueDate = issue.DueDate.ToString(),
                        // ReporterId = issue.OwnerId.ToString(),
                        ReporterId = reporterId.ToString(),
                        ProjectId = project.Id.ToString(),
                        UserIds = assigneeIdsList,
                        UsersWithCompletion = assigneeeCompletionLevel.ToList(),
                        Completed = issue.Completed,
                        Comments = commentDtos,
                        OwnerUsername = issueOwner.UserName,
                        ProjectName = project.Name,
                        GroupName = issueGroup.Name,
                        ReporterUsername = reporterUsername.UserName,
                        AssigneeUsernames = assigneeUsernames.ToArray(),
                        DependentOnIssues = issueDependencies.ToArray(),
                        GroupId = issueGroup.Id,
                        Predecessors = issuePredecessors.Select(x => new IssueDependenciesGetter
                        {
                            Id = x.Id,
                            Name = x.Name,
                            IsPredecessor = true,
                            ProjectName = project.Name,
                            GroupName = group.Name
                        }).ToList(),
                        Successors = issueSuccessors.Select(x => new IssueDependenciesGetter
                        {
                            Id = x.Id,
                            Name = x.Name,
                            IsPredecessor = false,
                            ProjectName = project.Name,
                            GroupName = group.Name
                        }).ToList()
                    };

                    issues.Add(issueDto);
                }
            }

            result.issues = issues.ToArray();
            result.users = users.ToArray();
            result.Groups = groupsDTO.ToArray();

            return Ok(result);
        }

        /* ***************************************************************************************
         * Create new project
         * *************************************************************************************** */
        [HttpPost]
        public async Task<ActionResult> CreateProject(ProjectDto projectDto)
        {

            if(await _projectsRepository.ProjectExistsByName(projectDto.Name))
            {
                return BadRequest(new { message = "Project name is taken" });
            }

            if(await _projectsRepository.ProjectExistsByKey(projectDto.Key))
            {
                return BadRequest(new { message = "Project key is taken" });
            }

            var temp = await _projectsRepository.CreateProject(projectDto);
            return Ok();
        }
        /* ***************************************************************************************
         * Update project with the given name
         * *************************************************************************************** */
        [HttpPut("transfer/{name}")]
        public async Task<ActionResult<string>> UpdateProject(string name,UserDto transferToUser)
        {
            var project = await _projectsRepository.GetProjectByName(name);

            await _userOnProjectRepository.RemoveUserFromProjectAsync(name, _usersRepository.IdToUsername(project.OwnerId).Result);

            var updated = await _projectsRepository.TransferProject(name, transferToUser.Username);

            if(updated == false)
            {
                return NotFound("There is no project whit specified name");
            }

            return Ok();
        }

        [HttpPut("{name}")]
        public async Task<ActionResult<string>> UpdateProject(string name, ProjectDto request)
        {
            /*
            if (await _projectsRepository.ProjectExistsByName(request.Name))
            {
                return BadRequest("Project name is taken");
            }
            */

            var updated = await _projectsRepository.UpdateProject(name, request);

            if (updated == false)
            {
                return NotFound("There is no project whit specified name");
            }

            return Ok();
        }

        /* ***************************************************************************************
         * Delete project with the given name
         * *************************************************************************************** */
        [HttpDelete("{name}")]
        public async Task<ActionResult<string>> DeleteProject(string name)
        {
            var deleted = await _projectsRepository.DeleteProject(name);

            if(deleted == false)
            {
                return NotFound("There is no project whit specified name");
            }
            return Ok();
        }
    }
}
