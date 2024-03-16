﻿using backAPI.DTO;
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
        public async Task<ActionResult<IEnumerable<string>>> GetCompanyRoles() {
            List<string> companyRoles = new List<string>();

            var roles = await companyRolesRepository.GetCompanyRolesAsync();

            if (roles == null)
                return BadRequest("There are no comany roles to fetch");

            foreach (var role in roles)
                companyRoles.Add(role.Name);
            
            return companyRoles;
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
        public async Task<ActionResult<string>> CreateCompanyRole(CompanyRoleDto role) {

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

            return Ok();
        }
        /* *****************************************************************************
         * PUT{id} | Update company role for the given id
         * ***************************************************************************** */
        [HttpPut("{id}")]
        public async Task<ActionResult<string>> UpdateCompanyRole(int id, CompanyRoleDto request) {
            var updated = await companyRolesRepository.UpdateCompanyRole(id, request);

            if(!updated) {
                return BadRequest("Cannot update the role!");
            }

            return Ok();
        }
        /* *****************************************************************************
         * DELETE{id} | Delete company role
         * ***************************************************************************** */
        [HttpDelete("{name}")]
        public async Task<ActionResult<string>> DeleteCompanyRole(string name) {
            var deleted = await companyRolesRepository.DeleteCompanyRole(name);

            if(deleted == false) {
                return NotFound("There is no company role with given name");
            }

            return Ok();
        }

    }
}
