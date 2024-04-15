using backAPI.Data;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface.Issues;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation.Issues
{
    public class IssueStatusRepository : IIssueStatusRepository
    {

        private readonly DataContext _dataContext;

        public IssueStatusRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<IssueStatus> GetIssueStatusById(int id)
        {
            return await _dataContext.IssueStatuses.Where(type => type.Id == id).FirstAsync();
        }

        public async Task<IssueStatus> GetIssueStatusByName(string name)
        {
            return await _dataContext.IssueStatuses.Where(type => type.Name == name).FirstAsync();
        }

        public async Task<List<IssueStatus>> GetAllIssueStatus()
        {
            return await _dataContext.IssueStatuses.ToListAsync();
        }
    }
}
