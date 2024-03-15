using backAPI.DTO;
using backAPI.DTO.Login;
using backAPI.Entities;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using backAPI.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Security.Cryptography;
using System.Text;

namespace backAPI.Controllers
{
    public class UsersController : BaseApiController
    {
        private readonly IUsersRepository _usersRepository;
        private readonly ICompanyRolesRepository _companyRolesRepository;
        private readonly IEmailService _emailService;


        // TODO: Dodati servis za JWT
        public UsersController(IUsersRepository usersRepository, IEmailService emailService, ICompanyRolesRepository companyRolesRepository) {
            _usersRepository = usersRepository;
            _emailService = emailService;
            _companyRolesRepository = companyRolesRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DTOUser>>> GetAllUsers() {
            List<DTOUser> dTOUsers = new List<DTOUser>();
            
            var users = await _usersRepository.GetUsersAsync();

            foreach (var user in users) {
                dTOUsers.Add(new DTOUser {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Username = user.Email,
                    CompanyRoleName = _companyRolesRepository.GetCompanyRoleById(user.CompanyRoleId).Result.Name, // ??
                    Address = user.Address,
                    ContactPhone = user.ContactPhone,
                    LinkedinProfile = user.LinkedinProfile,
                    Status = user.Status
                });
            }

            return dTOUsers;
        }

        /* *****************************************************************************
         * Delete user
         * ***************************************************************************** */
        [HttpDelete("{id}")]
        public async Task<ActionResult<string>> DeleteUser(int id) {
            var deleted = await _usersRepository.DeleteUser(id);

            if(deleted == false) {
                return NotFound("There is no user with specified id");
            }

            return Ok();
        }
    }
}
