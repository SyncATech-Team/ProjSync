using backAPI.DTO;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{

    // TODO: ne ubacivati autorizaciju dok login nije gotov
    public class CompanyrolesController : BaseApiController {

        private readonly ICompanyRolesRepository companyRolesRepository;

        /* *****************************************************************************
         * Konstruktor
         * ***************************************************************************** */
        public CompanyrolesController(ICompanyRolesRepository companyRolesRepository) {
            this.companyRolesRepository = companyRolesRepository;
        }

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
                    OvertimeHourPrice = role.OvertimeHourPrice,
                    WeekendHourPrice = role.WeekendHourPrice,
                    WorkingHourPrice = role.WorkingHourPrice,
                };
                companyRoles.Add(companyRoleDto);
            }
            
            return Ok(companyRoles);
        }

        /* *****************************************************************************
         * GET{id} | Get company role by ID
         * ***************************************************************************** */
        [HttpGet("{id}")]
        public async Task<ActionResult<CompanyRoleDto>> GetCompanyRole(int id) {
            var roles = await companyRolesRepository.GetCompanyRolesAsync();
            var role = roles.FirstOrDefault(role => role.Id == id);

            if(role == null) {
                return NotFound();
            }

            return new CompanyRoleDto {
                Name = role.Name,
                WorkingHourPrice = role.WorkingHourPrice,
                OvertimeHourPrice = role.OvertimeHourPrice,
                WeekendHourPrice = role.WeekendHourPrice
            };
        }
        /* *****************************************************************************
         * POST | Create new company role
         * ***************************************************************************** */
        [HttpPost]
        public async Task<ActionResult> CreateCompanyRole(CompanyRoleDto role) {

            if(await companyRolesRepository.CheckCompanyRoleNameExistance(role.Name)) {
                return BadRequest("Name " + role.Name + " is already used!");
            }

            // Convert DTO to Domain Model
            var companyRole = new CompanyRole {
                Name = role.Name,
                WorkingHourPrice = role.WorkingHourPrice,
                OvertimeHourPrice = role.OvertimeHourPrice,
                WeekendHourPrice = role.WeekendHourPrice
            };

            // save to database
            await companyRolesRepository.CreateNewRoleAsync(companyRole);

            return NoContent();
        }
        /* *****************************************************************************
         * PUT{id} | Update company role for the given id
         * ***************************************************************************** */
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCompanyRole(int id, CompanyRoleDto request) {
            var updated = await companyRolesRepository.UpdateCompanyRole(id, request);

            if(!updated) {
                return BadRequest("Cannot update the role!");
            }

            return NoContent();
        }
        /* *****************************************************************************
         * DELETE{id} | Delete company role
         * ***************************************************************************** */
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
