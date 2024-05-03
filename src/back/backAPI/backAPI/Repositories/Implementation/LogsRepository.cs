using backAPI.Data;
using backAPI.DTO;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation {
    public class LogsRepository : ILogsRepository {

        private readonly DataContext _dataContext;

        public LogsRepository(
            DataContext dataContext
        ) {
            _dataContext = dataContext;
        }

        public async Task<bool> AddLogToDatabase(Log log) {
            await _dataContext.Logs.AddAsync( log );
            await _dataContext.SaveChangesAsync();

            return true;
        }

        public async Task<int> GetLogCount(int projectId) {
            return await _dataContext.Logs.Where(log => log.ProjectId == projectId).CountAsync();
        }

        public async Task<IEnumerable<LogDto>> GetLogs(int projectId, int startIndex, int endIndex) {
            var logs = await _dataContext.Logs.Where(log => log.ProjectId == projectId).ToListAsync();
            logs.Sort(CustomLogComparer);
            Console.WriteLine(startIndex + " | " + (endIndex - startIndex));
            var numberOfElements = logs.Count();
            List<LogDto> result = new List<LogDto>();
            
            if(endIndex > numberOfElements) {
                for(int i = startIndex; i < numberOfElements - startIndex; i++) {
                    result.Add(new LogDto {
                        Id = logs[i].Id,
                        ProjectId = logs[i].ProjectId,
                        Message = logs[i].Message,
                        DateCreated = logs[i].DateCreated
                    });
                }
            }
            else {
                for(int i = startIndex; i < endIndex; i++) {
                    result.Add(new LogDto {
                        Id = logs[i].Id,
                        ProjectId = logs[i].ProjectId,
                        Message = logs[i].Message,
                        DateCreated = logs[i].DateCreated
                    });
                }
            }

            return result;
        }

        private int CustomLogComparer(Log log1, Log log2) {
            if (log1.DateCreated > log2.DateCreated) return -1;
            if (log1.DateCreated < log2.DateCreated) return 1;
            return 0;
        }

    }
}
