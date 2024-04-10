﻿using backAPI.DTO;
using backAPI.Repositories.Interface;
using backAPI.Repositories.Interface.Projects;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
    public class UserOnProjectController : BaseApiController
    {
        private readonly IUserOnProjectRepository _userOnProjectRepository;
        private readonly IProjectsRepository _projectRepository;
        private readonly ICompanyRolesRepository _companyRolesRepository;

        public UserOnProjectController(IUserOnProjectRepository userOnProjectRepository, IProjectsRepository projectRepository, ICompanyRolesRepository companyRolesRepository)
        {
            _userOnProjectRepository = userOnProjectRepository;
            _projectRepository = projectRepository;
            _companyRolesRepository = companyRolesRepository;
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
