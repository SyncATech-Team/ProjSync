﻿using backAPI.Data;
using backAPI.DTO.Issues;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using backAPI.Repositories.Interface.Issues;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation.Issues
{
    public class IssueGroupRepository : IIssueGroupRepository
    {

        private readonly DataContext dataContext;
        private readonly ILogsRepository logsRepository;

        /* *****************************************************************************
         * Konstruktor
         * ***************************************************************************** */
        public IssueGroupRepository(
            DataContext dataContext,
            ILogsRepository logsRepository
        ) {
            this.dataContext = dataContext;
            this.logsRepository = logsRepository;
        }
        /* *****************************************************************************
         * Dovlacenje svih grupa za odredjeni projekat
         * ***************************************************************************** */
        public async Task<IEnumerable<IssueGroup>> GetGroupsAsync(int projectId) 
        {
            return await dataContext.IssueGroups.Where(group => group.ProjectId == projectId).ToListAsync();
        }
        /* *****************************************************************************
         * Kreiranje grupe na projektu
         * ***************************************************************************** */
        public async Task<IssueGroup> CreateGroupAsync(IssueGroup group)
        {
            await dataContext.IssueGroups.AddAsync(group);
            await dataContext.SaveChangesAsync();

            await logsRepository.AddLogToDatabase(new Log {
                ProjectId = group.ProjectId,
                Message = "🆕 New group created: <strong>" + group.Name + "</strong>",
                DateCreated = DateTime.Now
            });

            return group;
        }
        /* *****************************************************************************
         * Brisanje grupe
         * ***************************************************************************** */
        public async Task<bool> DeleteGroupFromProjectAsync(int groupId)
        {
            var group = dataContext.IssueGroups.FirstOrDefaultAsync(group => group.Id == groupId);

            if (group == null)
            {
                return false;
            }
            var groupForReal = group.Result;
            dataContext.IssueGroups.Remove(groupForReal);
            await dataContext.SaveChangesAsync();
            return true;
        }


        public async Task<IssueGroupResponseDto> GetGroupForNameInProject(int projectId, int groupId) 
        {
            var result = await dataContext.IssueGroups.FirstOrDefaultAsync(group => group.ProjectId == projectId && group.Id == groupId);
            
            if(result == null) { 
                return null;
            }

            return new IssueGroupResponseDto 
            {
                Id = result.Id,
                Name = result.Name,
            };
        }

        /* *****************************************************************************
         * Provera da li postoji grupa sa istim imenom na datom projektu
         * ***************************************************************************** */
        public async Task<bool> GroupNameExistsWithinTheSameProject(int projectId, string name)
        {
            var x = await dataContext.IssueGroups.Where(group => group.ProjectId == projectId && group.Name == name).FirstOrDefaultAsync();

            if (x == null) { return false; }

            return true;
        }

        public async Task<IssueGroup> GetGroupByNameAsync(int projectId, string name)
        {
            return await dataContext.IssueGroups.Where(group => group.ProjectId == projectId && group.Name == name).FirstOrDefaultAsync();
        }

        public async Task<IssueGroup> GetGroupAsync(int id)
        {
            return await dataContext.IssueGroups.Where(group => group.Id == id).FirstOrDefaultAsync();
        }
    }
}
