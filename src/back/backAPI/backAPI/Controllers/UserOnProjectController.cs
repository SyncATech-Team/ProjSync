using backAPI.DTO;
using backAPI.DTO.Projects;
using backAPI.Other.Helpers;
using backAPI.Repositories.Interface;
using backAPI.Repositories.Interface.Projects;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace backAPI.Controllers
{
    public class UserOnProjectController : BaseApiController
    {
        private readonly IUsersRepository _usersRepository;
        private readonly IUserOnProjectRepository _userOnProjectRepository;
        private readonly IProjectsRepository _projectRepository;
        private readonly ICompanyRolesRepository _companyRolesRepository;
        private readonly IProjectTypesRepository _projectTypesRepository;
        private readonly IProjectVisibilitiesRepository _projectVisibilitiesRepository;

        public UserOnProjectController(IUserOnProjectRepository userOnProjectRepository, IProjectsRepository projectRepository, ICompanyRolesRepository companyRolesRepository, IProjectTypesRepository projectTypesRepository, IUsersRepository usersRepository, IProjectVisibilitiesRepository projectVisibilitiesRepository)
        {
            _userOnProjectRepository = userOnProjectRepository;
            _projectRepository = projectRepository;
            _companyRolesRepository = companyRolesRepository;
            _projectTypesRepository = projectTypesRepository;
            _usersRepository = usersRepository; 
            _projectVisibilitiesRepository = projectVisibilitiesRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsersOnProject(string projectName)
        {
            var project = await _projectRepository.GetProjectByName(projectName);
            List<UserDto> dTOUsers = new List<UserDto>();

            if (project == null)
            {
                return NotFound("Project not found");
            }

            var users = await _userOnProjectRepository.GetUsersOnProjectAsync(project.Name);
            foreach(var user in users)
            {
                dTOUsers.Add(new UserDto
                {
                    Username = user.UserName,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    CompanyRoleName = _companyRolesRepository.GetCompanyRoleById(user.CompanyRoleId).Result.Name,
                    ProfilePhoto = user.ProfilePhoto,
                    Address = user.Address,
                    ContactPhone = user.ContactPhone,
                    Status = user.Status,
                    IsVerified = user.IsVerified,
                    PreferedLanguage = user.PreferedLanguage,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt,
                    isActive = user.IsActive
                });
            }
            
            return Ok(dTOUsers);
        }

        [HttpGet("user/{username}")]
        public async Task<IActionResult> GetProjectsByUser(string username)
        {
            var user = await _usersRepository.GetUserByUsername(username);
            if(user == null)
            {
                return NotFound("User not found");
            }

            List<ProjectDto> dTOProjects = new List<ProjectDto>();

            var projects = await _userOnProjectRepository.GetProjectsByUser(username);
            foreach (var project in projects) {
                dTOProjects.Add(new ProjectDto
                {
                    Name = project.Name,
                    Description = project.Description,
                    Key = project.Key,
                    TypeName = _projectTypesRepository.GetProjectTypeById(project.TypeId).Result.Name,
                    OwnerUsername = _usersRepository.GetUserById(project.OwnerId).Result.UserName,
                    ParentProjectName = null,
                    CreationDate = project.CreationDate,
                    DueDate = project.DueDate,
                    Budget = project.Budget,
                    VisibilityName = _projectVisibilitiesRepository.GetProjectVisibilityByIdAsync(project.VisibilityId).Result.Name
                });
            }

            return Ok(dTOProjects);
        }

        [HttpGet("pagination")]
        public async Task<IActionResult> GetPaginationProjectsByUser(string projectName,string criteria)
        {
            var project = await _projectRepository.GetProjectByName(projectName);
            List<UserDto> dTOUsers = new List<UserDto>();
            UsersOnProjectLazyLoadDto lazyLoadDto = new UsersOnProjectLazyLoadDto();

            if (project == null)
            {
                return NotFound("Project not found");
            }

            Criteria criteriaObj = JsonConvert.DeserializeObject<Criteria>(criteria);

            var result = await _userOnProjectRepository.GetPaginationUsersOnProjectAsync(project.Name,criteriaObj);
            foreach (var user in result.users)
            {
                dTOUsers.Add(new UserDto
                {
                    Username = user.UserName,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    CompanyRoleName = _companyRolesRepository.GetCompanyRoleById(user.CompanyRoleId).Result.Name,
                    ProfilePhoto = user.ProfilePhoto,
                    Address = user.Address,
                    ContactPhone = user.ContactPhone,
                    Status = user.Status,
                    IsVerified = user.IsVerified,
                    PreferedLanguage = user.PreferedLanguage,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt,
                    isActive = user.IsActive
                });
            }

            lazyLoadDto.Users = dTOUsers;
            lazyLoadDto.NumberOfRecords = result.numberOfRecords;

            return Ok(lazyLoadDto);
        }

        [HttpGet("notOn")]
        public async Task<IActionResult> GetUsersNotOnProject(string projectName)
        {
            var project = await _projectRepository.GetProjectByName(projectName);
            List<UserDto> dTOUsers = new List<UserDto>();

            if (project == null)
            {
                return NotFound("Project not found");
            }

            var users = await _userOnProjectRepository.GetUsersNotOnProjectAsync(project.Name);
            foreach (var user in users)
            {
                dTOUsers.Add(new UserDto
                {
                    Username = user.UserName,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    CompanyRoleName = _companyRolesRepository.GetCompanyRoleById(user.CompanyRoleId).Result.Name,
                    ProfilePhoto = user.ProfilePhoto,
                    Address = user.Address,
                    ContactPhone = user.ContactPhone,
                    Status = user.Status,
                    IsVerified = user.IsVerified,
                    PreferedLanguage = user.PreferedLanguage,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt,
                    isActive = user.IsActive
                });
            }

            return Ok(dTOUsers);
        }

        [HttpPost]
        
        public async Task<IActionResult> AddUserOnProject(string projectName, string username, string color)
        {
            var added = await _userOnProjectRepository.AddUserToProjectAsync(projectName, username, color);
            if (added == false)
            {
                return BadRequest( new {message = "Unable to add user to project"});
            }

            return Ok(new { message = "User added on project"});
        }

        [HttpDelete]

        public async Task<IActionResult> DeleteUserFromProject(string projectName, string username)
        {
            var removed = await _userOnProjectRepository.RemoveUserFromProjectAsync(projectName, username);

            if (removed)
            {
                return Ok(new { message = "User removed from project successfully." });
                
            }
            else
            {
                return BadRequest(new { message = "Failed to remove user from project" });
            }
        }
    }
}
