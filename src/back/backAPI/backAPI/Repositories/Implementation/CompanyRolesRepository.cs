using backAPI.Data;
using backAPI.DTO;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using System.Xml.Linq;

namespace backAPI.Repositories.Implementation
{
    public class CompanyRolesRepository : ICompanyRolesRepository {

        private readonly DataContext dataContext;

        /* **************************************************************************
         * Konstruktor
         * ************************************************************************** */
        public CompanyRolesRepository(DataContext dataContext) {
            this.dataContext = dataContext;
        }

        /* **************************************************************************
         * POST | Metod za kreiranje nove uloge u kompaniji
         * ************************************************************************** */
        public async Task<CompanyRole> CreateNewRoleAsync(CompanyRole companyRole) {
            await dataContext.CRoles.AddAsync(companyRole);
            await dataContext.SaveChangesAsync();

            return companyRole;
        }

        /// <summary>
        /// Dohvatanje svih objekata iz baze
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<CompanyRole>> GetCompanyRolesAsync() {
            return await dataContext.CRoles.ToListAsync();
        }

        /* **************************************************************************
         * DELETE | Obrisi ulogu za prosledjeni naziv
         * ************************************************************************** */
        public async Task<bool> DeleteCompanyRole(string name) {

            var roleId = await GetCompanyRoleByNameAsync(name);
            var role = await dataContext.CRoles.FindAsync(roleId.Id);
            
            if(role == null) {
                return false;
            }

            dataContext.CRoles.Remove(role);
            await dataContext.SaveChangesAsync();

            return true;
        }
        /* **************************************************************************
         * PUT | Izmeni entitet za prosledjeno ime
         * ************************************************************************** */
        public async Task<bool> UpdateCompanyRole(string name, CompanyRoleDto request) {
            var role = await GetCompanyRoleByNameAsync(name);

            if (role == null || await CheckCompanyRoleNameExistance(request.Name) == true) {
                return false;
            }

            role.Name = request.Name;
            await dataContext.SaveChangesAsync();

            return true;
        }

        public async Task<CompanyRole> GetCompanyRoleById(int id) {
            return await dataContext.CRoles.Where(role => role.Id == id).FirstAsync();
        }

        /* **************************************************************************
         * Provera da li u bazi vec postoji uloga koju zelimo da dodamo
         * ************************************************************************** */
        public async Task<bool> CheckCompanyRoleNameExistance(string name) {
            return await dataContext.CRoles.AnyAsync(role => role.Name.ToLower() == name.ToLower());
        }

        public async Task<CompanyRole> GetCompanyRoleByNameAsync(string companyRoleName)
        {
            return await dataContext.CRoles
                .Where(x => x.Name == companyRoleName)
                .SingleOrDefaultAsync();
        }
    }
}
