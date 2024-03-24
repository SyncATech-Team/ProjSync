using backAPI.DTO;
using backAPI.Repositories.Implementation;
using backAPI.Repositories.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
    public class UserOnProjectController : BaseApiController
    {
        private readonly IUserOnProjectRepository _userOnProjectRepository;
        private readonly IProjectsRepository _projectRepository;

        public UserOnProjectController(IUserOnProjectRepository userOnProjectRepository, IProjectsRepository projectRepository)
        {
            _userOnProjectRepository = userOnProjectRepository;
            _projectRepository = projectRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsersOnProject(string projectName)
        {
            var project = await _projectRepository.GetProjectByName(projectName);
            List<UserOnProjectDto> dTOUsers = new List<UserOnProjectDto>();

            if (project == null)
            {
                return NotFound("Project not found");
            }

            var users = await _userOnProjectRepository.GetUsersOnProjectAsync(project.Name);
            foreach(var user in users)
            {
                dTOUsers.Add(new UserOnProjectDto
                {
                    Username = user.UserName
                });
            }
            
            return Ok(dTOUsers);
        }

        [HttpPost]
        
        public async Task<IActionResult> AddUserOnProject(string projectName, UserOnProjectDto request)
        {
            var added = _userOnProjectRepository.AddUserToProjectAsync(projectName, request).Result;
            if (added == false)
            {
                return BadRequest("Unable to add user to project");
            }

            return Ok("User added on project");
        }
    }
}
