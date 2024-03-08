using backAPI.Data;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation {
    public class WorkingHoursRepository : IWorkingHoursRepository {
        
        private readonly DataContext dataContext;

        /* *****************************************************************************
         * Konstruktor
         * ***************************************************************************** */
        public WorkingHoursRepository(DataContext dataContext) { 
            this.dataContext = dataContext;
        }
        /* *****************************************************************************
         * GET | Daj sve radne sate za sve radnike
         * ***************************************************************************** */
        public async Task<IEnumerable<WorkingHours>> GetWorkingHoursAsync() {
            return await dataContext.WorkHours.ToListAsync();
        }
    }
}
