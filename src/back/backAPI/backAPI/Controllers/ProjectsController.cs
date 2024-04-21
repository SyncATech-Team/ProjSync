using backAPI.Data;
using backAPI.DTO;
using backAPI.DTO.Issues;
using backAPI.DTO.Projects;
using backAPI.Entities.Domain;
using backAPI.Repositories.Implementation;
using backAPI.Repositories.Implementation.Issues;
using backAPI.Repositories.Interface;
using backAPI.Repositories.Interface.Issues;
using backAPI.Repositories.Interface.Projects;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
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

        public ProjectsController(IProjectsRepository projectsRepository, IUsersRepository usersRepository,
            IProjectTypesRepository projectTypesRepository, IProjectVisibilitiesRepository projectVisibilitiesRepository,
            IIssueRepository issueRepository,IIssueTypeRepository issueTypeRepository, IIssueStatusRepository issueStatusRepository,
            IIssuePriorityRepository issuePriorityRepository, IIssueGroupRepository issueGroupRepository, IUserOnIssueRepository userOnIssueRepository,
            IUserOnProjectRepository userOnProjectRepository)
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

                result.Add(new ProjectDto {
                    Name = project.Name,
                    Key = project.Key,
                    TypeName = type.Name,
                    Description = project.Description,
                    CreationDate = project.CreationDate,
                    DueDate = project.DueDate,
                    OwnerUsername = owner,
                    ParentProjectName = parentName,
                    Budget = project.Budget,
                    VisibilityName = visibility.Name
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
                
                dTOProjects.Add(new ProjectDto
                {
                    Name = project.Name,
                    Key = project.Key,
                    Description = project.Description,
                    TypeName = _projectTypesRepository.GetProjectTypeById(project.TypeId).Result.Name,
                    CreationDate = project.CreationDate,
                    DueDate = project.DueDate,
                    OwnerUsername = await _usersRepository.IdToUsername(project.OwnerId),
                    Budget = project.Budget,
                    VisibilityName = _projectVisibilitiesRepository.GetProjectVisibilityByIdAsync(project.VisibilityId).Result.Name

                });
            }

            return Ok(dTOProjects);
        }

        /// <summary>
        /// Dohvatanje projekta sa svim zadacima
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

            foreach (var group in groups)
            {
                var issuesInGroup = await _issueRepository.GetAllIssuesForGivenGroup(group.Id);

                foreach (var issue in issuesInGroup)
                {
                    var issueType = await _issueTypeRepository.GetIssueTypeById(issue.TypeId);
                    var issuePriority = await _issuePriorityRepository.GetIssuePriorityById(issue.StatusId);
                    var issueStatus = await _issueStatusRepository.GetIssueStatusById(issue.StatusId);
                    var assigneeIds = await _issueRepository.GetAssigneeIds(issue.Id);
                    var project = projectByName;

                    List<string> assigneeIdsList = new List<string>();
                    foreach (var assigneeId in assigneeIds)
                    {
                        assigneeIdsList.Add(assigneeId.ToString());
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
                        ReporterId = issue.OwnerId.ToString(),
                        ProjectId = project.Id.ToString(),
                        UserIds = assigneeIdsList
                    };

                    issues.Add(issueDto);
                }
            }

            result.issues = issues.ToArray();
            result.users = users.ToArray();

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
                return BadRequest("Project name is taken");
            }

            if(await _projectsRepository.ProjectExistsByKey(projectDto.Key))
            {
                return BadRequest("Project key is taken");
            }

            var temp = await _projectsRepository.CreateProject(projectDto);

            if(temp == null)
            {
                return BadRequest("Project name or type or visibility is null");
            }

            return Ok();
        }
        /* ***************************************************************************************
         * Update project with the given name
         * *************************************************************************************** */
        [HttpPut("{name}")]
        public async Task<ActionResult<string>> UpdateProject(string name,ProjectDto request)
        {
            if (await _projectsRepository.ProjectExistsByName(request.Name))
            {
                return BadRequest("Project name is taken");
            }

            var updated = await _projectsRepository.UpdateProject(name, request);

            if(updated == false)
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
