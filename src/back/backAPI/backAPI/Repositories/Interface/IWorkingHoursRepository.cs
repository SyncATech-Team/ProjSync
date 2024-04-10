using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface
{
    public interface IWorkingHoursRepository {

        Task<IEnumerable<WorkingHours>> GetWorkingHoursAsync();

    }
}
