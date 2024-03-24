using backAPI.DTO;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{

    //[Authorize(Policy = "RequireAdminRole")]
    public class CompanyrolesController : BaseApiController {

        private readonly ICompanyRolesRepository companyRolesRepository;

        /// <summary>
        /// Konstruktor
        /// </summary>
        /// <param name="companyRolesRepository"></param>
        public CompanyrolesController(ICompanyRolesRepository companyRolesRepository) {
            this.companyRolesRepository = companyRolesRepository;
        }
        /// <summary>
        /// Dovlacenje svih uloga
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CompanyRoleDto>>> GetCompanyRoles() {
            List<CompanyRoleDto> companyRoles = new List<CompanyRoleDto>();

            var roles = await companyRolesRepository.GetCompanyRolesAsync();

            if (roles == null)
                return BadRequest("There are no comany roles to fetch");

            foreach (var role in roles)
            {
                var companyRoleDto = new CompanyRoleDto
                {
                    Name = role.Name,
                    CanManageProjects = role.CanManageProjects,
                    CanManageTasks = role.CanManageTasks,
                    CanUpdateTaskProgress = role.CanUpdateTaskProgress,
                    CanLeaveComments = role.CanLeaveComments,
                    CanUploadFiles = role.CanUploadFiles
                };
                companyRoles.Add(companyRoleDto);
            }
            
            return Ok(companyRoles);
        }
        /// <summary>
        /// Dovlacenje uloge po imenu
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        [HttpGet("{name}")]
        public async Task<ActionResult<CompanyRoleDto>> GetCompanyRole(string name) {
            var roles = await companyRolesRepository.GetCompanyRolesAsync();
            var role = roles.FirstOrDefault(role => role.Name == name);

            if(role == null) {
                return NotFound();
            }

            return new CompanyRoleDto {
                Name = role.Name,
                CanManageProjects = role.CanManageProjects,
                CanManageTasks = role.CanManageTasks,
                CanUpdateTaskProgress = role.CanUpdateTaskProgress,
                CanLeaveComments = role.CanLeaveComments,
                CanUploadFiles = role.CanUploadFiles
            };
        }
        /// <summary>
        /// Kreiranje nove uloge
        /// </summary>
        /// <param name="role"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> CreateCompanyRole(CompanyRoleDto role) {

            if(await companyRolesRepository.CheckCompanyRoleNameExistance(role.Name)) {
                return BadRequest("Name " + role.Name + " is already used!");
            }

            // Convert DTO to Domain Model
            var companyRole = new CompanyRole {
                Name = role.Name,
                CanManageProjects = role.CanManageProjects,
                CanManageTasks = role.CanManageTasks,
                CanLeaveComments = role.CanLeaveComments,
                CanUploadFiles = role.CanUploadFiles,
                CanUpdateTaskProgress = role.CanUpdateTaskProgress
            };

            // save to database
            await companyRolesRepository.CreateNewRoleAsync(companyRole);

            return NoContent();
        }
        /// <summary>
        /// Update uloge po imenu
        /// </summary>
        /// <param name="name"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPut("{name}")]
        public async Task<ActionResult> UpdateCompanyRole(string name, CompanyRoleDto request) {
            var updated = await companyRolesRepository.UpdateCompanyRole(name, request);

            if(!updated) {
                return BadRequest("Cannot update the role!");
            }

            return NoContent();
        }
        /// <summary>
        /// Brisanje uloge po imenu
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        [HttpDelete("{name}")]
        public async Task<ActionResult> DeleteCompanyRole(string name) {
            var deleted = await companyRolesRepository.DeleteCompanyRole(name);

            if(deleted == false) {
                return NotFound("There is no company role with given name");
            }

            return NoContent();
        }

    }
}
