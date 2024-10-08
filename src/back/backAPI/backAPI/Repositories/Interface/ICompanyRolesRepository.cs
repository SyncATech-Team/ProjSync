﻿using backAPI.DTO;
using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface
{
    public interface ICompanyRolesRepository {

        Task<CompanyRole> CreateNewRoleAsync(CompanyRole companyRole);
        Task<IEnumerable<CompanyRole>> GetCompanyRolesAsync();
        Task<CompanyRole> GetCompanyRoleByNameAsync(string companyRoleName);
        Task<bool> DeleteCompanyRole(string name);
        Task<string> UpdateCompanyRole(string name, CompanyRoleDto request);
        Task<bool> CheckCompanyRoleNameExistance(string name);
        Task<CompanyRole> GetCompanyRoleById(int id);
    }
}
