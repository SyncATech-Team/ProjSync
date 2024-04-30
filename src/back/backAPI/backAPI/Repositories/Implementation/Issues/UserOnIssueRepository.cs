using System.Threading.Tasks;
using backAPI.Data;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface.Issues;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        public async Task<bool> AddUserOnIssue(IEnumerable<UsersOnIssue> usersOnIssue) {
            await _dataContext.UsersOnIssues.AddRangeAsync(usersOnIssue);
            await _dataContext.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Issue>> UserIssuess(int userId)
        {
            var userIssues = await _dataContext.UsersOnIssues
                .Where(ui => ui.UserId == userId && ui.Reporting == false && ui.Issue.Completed < 100)
                .Select(ui => ui.Issue)
                .ToListAsync();

            return userIssues;
        }
    }
}
