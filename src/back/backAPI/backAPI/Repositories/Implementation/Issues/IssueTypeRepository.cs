using backAPI.Data;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface.Issues;
using Microsoft.EntityFrameworkCore;
using System.Xml.Linq;

namespace backAPI.Repositories.Implementation.Issues
{
    public class IssueTypeRepository : IIssueTypeRepository
    {

        private readonly DataContext _dataContext;

        public IssueTypeRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<IssueType> GetTaskTypeById(int id)
        {
            return await _dataContext.IssueTypes.Where(type => type.Id == id).FirstAsync();
        }

        public async Task<IssueType> GetTaskTypeByName(string name)
        {
            return await _dataContext.IssueTypes.Where(type => type.Name == name).FirstAsync();
        }

        public async Task<List<IssueType>> GetAllIssueTypes()
        {
            return await _dataContext.IssueTypes.ToListAsync();
        }
    }
}
