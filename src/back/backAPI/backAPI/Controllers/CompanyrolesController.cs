using backAPI.Entities.Domain;
using backAPI.Entities.DTO;
using backAPI.Repositories.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers {

    // localhost:xyzt/api/companyroles
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyrolesController : ControllerBase {

        private readonly ICompanyRolesRepository companyRolesRepository;

        /* *****************************************************************************
         * Konstruktor
         * ***************************************************************************** */
        public CompanyrolesController(ICompanyRolesRepository companyRolesRepository) {
            this.companyRolesRepository = companyRolesRepository;
        }
        /* *****************************************************************************
         * GET | Get ALL company roles
         * ***************************************************************************** */
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CompanyRoleDTO>>> GetCompanyRoles() {
            List<CompanyRoleDTO> companyRoles = new List<CompanyRoleDTO>();

            var roles = await companyRolesRepository.GetCompanyRolesAsync();

            // Encapsulate CompanyRole to CompanyRoleDTO object
            foreach (var role in roles) {
                companyRoles.Add(
                    new CompanyRoleDTO {
                        RoleCompanyName = role.RoleCompanyName,
                        WorkingHourPrice = role.WorkingHourPrice,
                        OvertimeHourPrice = role.OvertimeHourPrice,
                        WeekendHourPrice = role.WeekendHourPrice
                    }
                );
            }

            return companyRoles;
        }
        /* *****************************************************************************
         * GET{id} | Get company role by ID
         * ***************************************************************************** */
        [HttpGet("{id}")]
        public async Task<ActionResult<CompanyRoleDTO>> GetCompanyRole(int id) {
            var roles = await companyRolesRepository.GetCompanyRolesAsync();
            var role = roles.FirstOrDefault(role => role.RoleCompanyId == id);

            if(role == null) {
                return NotFound();
            }

            return new CompanyRoleDTO {
                RoleCompanyName = role.RoleCompanyName,
                WorkingHourPrice = role.WorkingHourPrice,
                OvertimeHourPrice = role.OvertimeHourPrice,
                WeekendHourPrice = role.WeekendHourPrice
            };
        }
        /* *****************************************************************************
         * POST | Create new company role
         * ***************************************************************************** */
        [HttpPost]
        public async Task<ActionResult<CompanyRoleDTO>> CreateCompanyRole(CompanyRoleDTO role) {

            if(await companyRolesRepository.CheckCompanyRoleNameExistance(role.RoleCompanyName)) {
                return BadRequest("Name " + role.RoleCompanyName + " is already used!");
            }

            // Convert DTO to Domain Model
            var companyRole = new CompanyRole {
                RoleCompanyName = role.RoleCompanyName,
                WorkingHourPrice = role.WorkingHourPrice,
                OvertimeHourPrice = role.OvertimeHourPrice,
                WeekendHourPrice = role.WeekendHourPrice
            };

            // save to database
            await companyRolesRepository.CreateNewRoleAsync(companyRole);

            // Map back from Domain model to DTO
            return new CompanyRoleDTO {
                RoleCompanyName = companyRole.RoleCompanyName,
                WorkingHourPrice = companyRole.WorkingHourPrice,
                OvertimeHourPrice = companyRole.OvertimeHourPrice,
                WeekendHourPrice = companyRole.WeekendHourPrice
            };
        }
        /* *****************************************************************************
         * PUT{id} | Update company role for the given id
         * ***************************************************************************** */
        [HttpPut("{id}")]
        public async Task<ActionResult<bool>> UpdateCompanyRole(int id, CompanyRoleDTO request) {
            var updated = await companyRolesRepository.UpdateCompanyRole(id, request);

            if(!updated) {
                return BadRequest("Cannot update the role!");
            }

            return Ok();
        }
        /* *****************************************************************************
         * DELETE{id} | Delete company role
         * ***************************************************************************** */
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeleteCompanyRole(int id) {
            var deleted = await companyRolesRepository.DeleteCompanyRole(id);

            if(deleted == false) {
                return NotFound("There is no company role for the given id");
            }

            return Ok();
        }

    }
}
