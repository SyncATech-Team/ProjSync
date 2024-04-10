using System.Threading.Tasks;
using backAPI.Data;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface.Issues;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Repositories.Implementation.Issues
{
    public class UserOnIssueRepository : IUserOnIssueRepository
    {
        private readonly DataContext _dataContext;

        public UserOnIssueRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        public async Task<UsersOnIssue> AddUserOnIssue(UsersOnIssue userOnIssue)
        {
            await _dataContext.UsersOnIssues.AddAsync(userOnIssue);
            await _dataContext.SaveChangesAsync();
            return userOnIssue;
        }
    }
}
