using backAPI.Data;
using backAPI.Entities.Domain;
using backAPI.Entities.DTO;
using backAPI.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation {
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
        /* **************************************************************************
         * GET | Daj sve uloge
         * ************************************************************************** */
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
        public async Task<bool> UpdateCompanyRole(int id, CompanyRoleDTO request) {
            var role = await dataContext.Roles.FindAsync(id);

            if (role == null || await CheckCompanyRoleNameExistance(request.RoleCompanyName) == true) {
                return false;
            }

            role.RoleCompanyName = request.RoleCompanyName;
            role.OvertimeHourPrice = request.OvertimeHourPrice;
            role.WorkingHourPrice = request.WorkingHourPrice;
            role.WeekendHourPrice = request.WeekendHourPrice;
            await dataContext.SaveChangesAsync();

            return true;
        }
        /* **************************************************************************
         * Provera da li u bazi vec postoji uloga koju zelimo da dodamo
         * ************************************************************************** */
        public async Task<bool> CheckCompanyRoleNameExistance(string name) {
            return await dataContext.Roles.AnyAsync(role => role.RoleCompanyName.ToLower() == name.ToLower());
        }
    }
}
