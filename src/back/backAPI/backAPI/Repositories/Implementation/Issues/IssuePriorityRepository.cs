﻿using backAPI.Data;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface.Issues;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation.Issues
{
    public class IssuePriorityRepository : IIssuePriorityRepository
    {

        private readonly DataContext _dataContext;

        public IssuePriorityRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<IssuePriority> GetIssuePriorityById(int id)
        {
            return await _dataContext.IssuePriority.Where(x => x.Id == id).FirstAsync();
        }

        public async Task<IssuePriority> GetIssuePriorityByName(string name)
        {
            return await _dataContext.IssuePriority.Where(x => x.Name == name).FirstAsync();
        }

        public async Task<List<IssuePriority>> GetAllIssuePrioritys()
        {
            return await _dataContext.IssuePriority.ToListAsync();
        }
    }
}
