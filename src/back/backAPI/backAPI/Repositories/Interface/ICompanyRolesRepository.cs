using backAPI.Entities.Domain;
using backAPI.Entities.DTO;

namespace backAPI.Repositories.Interface {
    public interface ICompanyRolesRepository {

        Task<CompanyRole> CreateNewRoleAsync(CompanyRole companyRole);
        Task<IEnumerable<CompanyRole>> GetCompanyRolesAsync();
        Task<bool> DeleteCompanyRole(int id);
        Task<bool> UpdateCompanyRole(int id, CompanyRoleDTO request);


        Task<bool> CheckCompanyRoleNameExistance(string name);
    }
}
