using backAPI.DTO;
using backAPI.Repositories.Interface;
using backAPI.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
    public class UsersController : BaseApiController {
        private readonly IUsersRepository _usersRepository;
        private readonly ICompanyRolesRepository _companyRolesRepository;
        private readonly IEmailService _emailService;


        // TODO: Dodati servis za JWT
        public UsersController(IUsersRepository usersRepository, IEmailService emailService, ICompanyRolesRepository companyRolesRepository) {
            _usersRepository = usersRepository;
            _emailService = emailService;
            _companyRolesRepository = companyRolesRepository;
        }

        /* *****************************************************************************
         * Get all users
         * ***************************************************************************** */
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers() {
            List<UserDto> dTOUsers = new List<UserDto>();
          
            var users = await _usersRepository.GetUsersAsync();

            foreach (var user in users) {
                // Enkapsuliraj podatke o korisniku u DTO objekat
                dTOUsers.Add(new UserDto {
                    Username = user.UserName,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    CompanyRoleName = _companyRolesRepository.GetCompanyRoleById(user.CompanyRoleId).Result.Name, // ??
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

            return dTOUsers;
        }

        /* *****************************************************************************
         * Get user by username
         * ***************************************************************************** */
        [HttpGet("{username}")]
        public async Task<ActionResult<UserDto>> GetUserByUsername(string username) {
            var user = await _usersRepository.GetUserByUsername(username);

            if (user == null) {
                return NotFound();
            }

            return Ok(new UserDto {
                Username = user.UserName,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                CompanyRoleName = _companyRolesRepository.GetCompanyRoleById(user.CompanyRoleId).Result.Name, // ??
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
        /* *****************************************************************************
         * Ubdate user for given username
         * ***************************************************************************** */
        [HttpPut("{username}")]
        public async Task<ActionResult<string>> UpdateUser(string username, UserDto request) {
            
            var updated = await _usersRepository.UpdateUser(username, request);
            if(updated != "OK") {
                return BadRequest(updated);
            }

            return Ok();
        }

        /* *****************************************************************************
         * Delete user
         * ***************************************************************************** */
        [HttpDelete("{username}")]
        public async Task<ActionResult<string>> DeleteUser(string username) {
            var deleted = await _usersRepository.DeleteUser(username);

            if(deleted == false) {
                return NotFound("There is no user with specified username");
            }

            return Ok();
        }
    }
}
