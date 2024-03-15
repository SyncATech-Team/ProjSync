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
            await dataContext.Roles.AddAsync(companyRole);
            await dataContext.SaveChangesAsync();

            return companyRole;
        }

        /// <summary>
        /// Dohvatanje svih objekata iz baze
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<CompanyRole>> GetCompanyRolesAsync() {
            return await dataContext.Roles.ToListAsync();
        }

        /* **************************************************************************
         * DELETE | Obrisi ulogu za prosledjeni id
         * ************************************************************************** */
        public async Task<bool> DeleteCompanyRole(int id) {

            var role = await dataContext.Roles.FindAsync(id);
            
            if(role == null) {
                return false;
            }

            dataContext.Roles.Remove(role);
            await dataContext.SaveChangesAsync();

            return true;
        }
        /* **************************************************************************
         * PUT | Izmeni entitet za prosledjeni id
         * ************************************************************************** */
        public async Task<bool> UpdateCompanyRole(int id, CompanyRoleDto request) {
            var role = await dataContext.Roles.FindAsync(id);

            if (role == null || await CheckCompanyRoleNameExistance(request.Name) == true) {
                return false;
            }

            role.Name = request.Name;
            role.OvertimeHourPrice = request.OvertimeHourPrice;
            role.WorkingHourPrice = request.WorkingHourPrice;
            role.WeekendHourPrice = request.WeekendHourPrice;
            await dataContext.SaveChangesAsync();

            return true;
        }

        public async Task<CompanyRole> GetCompanyRoleById(int id) {
            return await dataContext.Roles.Where(role => role.Id == id).FirstAsync();
        }

        /* **************************************************************************
         * Provera da li u bazi vec postoji uloga koju zelimo da dodamo
         * ************************************************************************** */
        public async Task<bool> CheckCompanyRoleNameExistance(string name) {
            return await dataContext.Roles.AnyAsync(role => role.Name.ToLower() == name.ToLower());
        }

        public async Task<CompanyRole> GetCompanyRoleByNameAsync(string companyRoleName)
        {
            return await dataContext.Roles
                .Where(x => x.Name == companyRoleName)
                .SingleOrDefaultAsync();
        }
    }
}
