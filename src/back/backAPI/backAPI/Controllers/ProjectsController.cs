using backAPI.DTO.Issues;
using backAPI.DTO.Projects;
using backAPI.Entities.Domain;
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

        public ProjectsController(IProjectsRepository projectsRepository, IUsersRepository usersRepository,
            IProjectTypesRepository projectTypesRepository, IProjectVisibilitiesRepository projectVisibilitiesRepository,
            IIssueRepository issueRepository,IIssueTypeRepository issueTypeRepository, IIssueStatusRepository issueStatusRepository,
            IIssuePriorityRepository issuePriorityRepository, IIssueGroupRepository issueGroupRepository, IUserOnIssueRepository userOnIssueRepository)
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

            result.Id = projectByName.Id.ToString();
            result.Name = projectName;
            result.Description = projectByName.Description;
            result.ProjectCategory = projectByName.ProjectType.ToString();
            result.CreatedAt = projectByName.CreationDate.ToString();
            // update date

            List<JIssueDto> issues = new List<JIssueDto>();

            foreach (var group in groups)
            {
                var issuesInGroup = await _issueRepository.GetAllIssuesForGivenGroup(group.Id);

                foreach (var issue in issuesInGroup)
                {
                    var issueType = await _issueTypeRepository.GetIssueTypeById(issue.TypeId);
                    var issuePriority = await _issuePriorityRepository.GetIssuePriorityById(issue.StatusId);
                    var issueStatus = await _issueStatusRepository.GetIssueStatusById(issue.StatusId);
                    var issueOwner = await _usersRepository.GetUserById(issue.OwnerId);
                    var assigneeIds = await _issueRepository.GetAssigneeIds(issue.Id);
                    var project = projectByName;

                    List<string> assigneeUsernames = new List<string>();
                    foreach (var assignee in assigneeIds)
                    {
                        var user = await _usersRepository.GetUserById(assignee);
                        assigneeUsernames.Add(user.UserName);
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
                        ReporterId = issueOwner.Id.ToString(),
                        ProjectId = project.Id.ToString(),
                        UserIds = assigneeUsernames
                    };

                    issues.Add(issueDto);
                }
            }

            result.issues = issues.ToArray();

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
