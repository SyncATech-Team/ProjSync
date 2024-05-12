using backAPI.DTO;
using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface {
    public interface ILogsRepository {

        Task<bool> AddLogToDatabase(Log log);
        Task<IEnumerable<LogDto>> GetLogs(int projectId, int startIndex, int endIndex);
        Task<int> GetLogCount(int projectId);
    }
}
