using backAPI.Data;
using backAPI.DTO;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation
{
    public class CompanyRolesRepository : ICompanyRolesRepository {

        private readonly DataContext dataContext;

        /// <summary>
        /// Konstruktor
        /// </summary>
        /// <param name="dataContext"></param>
        public CompanyRolesRepository(DataContext dataContext) {
            this.dataContext = dataContext;
        }
        /// <summary>
        /// Metod za kreiranje nove uloge u kompaniji
        /// </summary>
        /// <param name="companyRole"></param>
        /// <returns>CompanyRole - kreirana uloga</returns>
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
        /// <summary>
        /// Brisanje uloge sa odredjenim nazivom
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
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
        /// <summary>
        /// Izmeni entitet za prosledjeno ime
        /// </summary>
        /// <param name="name"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        public async Task<bool> UpdateCompanyRole(string name, CompanyRoleDto request) {
            var role = await GetCompanyRoleByNameAsync(name);

            if (role == null || await CheckCompanyRoleNameExistance(request.Name) == true) {
                return false;
            }

            role.Name = request.Name;
            role.CanUpdateTaskProgress = request.CanUpdateTaskProgress;
            role.CanManageProjects = request.CanManageProjects;
            role.CanManageTasks = request.CanManageTasks;
            role.CanUploadFiles = request.CanUploadFiles;
            role.CanLeaveComments = request.CanLeaveComments;

            await dataContext.SaveChangesAsync();

            return true;
        }
        /// <summary>
        /// Dohvatanje role za prosledjeni ID
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<CompanyRole> GetCompanyRoleById(int id) {
            return await dataContext.CRoles.Where(role => role.Id == id).FirstAsync();
        }
        /// <summary>
        /// Provera da li u bazi vec postoji uloga koju zelimo da dodamo
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public async Task<bool> CheckCompanyRoleNameExistance(string name) {
            return await dataContext.CRoles.AnyAsync(role => role.Name.ToLower() == name.ToLower());
        }
        /// <summary>
        /// Dohvatanje role za prosledjeno ime
        /// </summary>
        /// <param name="companyRoleName"></param>
        /// <returns></returns>
        public async Task<CompanyRole> GetCompanyRoleByNameAsync(string companyRoleName)
        {
            return await dataContext.CRoles
                .Where(x => x.Name == companyRoleName)
                .SingleOrDefaultAsync();
        }
    }
}
