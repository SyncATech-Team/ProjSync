﻿using backAPI.DTO.Issues;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using backAPI.Repositories.Interface.Projects;
using backAPI.Repositories.Interface.Issues;
using Microsoft.AspNetCore.Mvc;
using backAPI.Other.Helpers;
using Newtonsoft.Json;
using backAPI.SignalR;
using backAPI.DTO;
using Microsoft.AspNetCore.Authorization;

namespace backAPI.Controllers
{
    [Authorize]
    public class IssuesController : BaseApiController 
    {

        private readonly IIssueRepository _issueRepository;
        private readonly IProjectsRepository _projectsRepository;
        private readonly IIssueTypeRepository _issueTypeRepository;
        private readonly IIssueStatusRepository _issueStatusRepository;
        private readonly IUsersRepository _usersRepository;
        private readonly IIssuePriorityRepository _issuePriorityRepository;
        private readonly IIssueGroupRepository _issueGroupRepository;
        private readonly IUserOnIssueRepository _userOnIssueRepository;
        private readonly NotificationService _issueNotificationService;
        private readonly INotificationsRepository _notificationsRepository;
        private readonly IIssueCommentRepository _issueCommentRepository;

        /* ***************************************************************************************************
         * Konstruktor
         * *************************************************************************************************** */
        public IssuesController(
            IIssueRepository issueRepository,
            IProjectsRepository projectsRepository, 
            IIssueTypeRepository issueTypeRepository,
            IIssueStatusRepository issueStatusRepository, 
            IUsersRepository usersRepository,
            IIssuePriorityRepository issuePriorityRepository,
            IIssueGroupRepository issueGroupRepository,
            IUserOnIssueRepository userOnIssueRepository,
            NotificationService issueNotificationService,
            INotificationsRepository notificationsRepository,
            IIssueCommentRepository issueCommentRepository
            ) {
                _issueRepository = issueRepository;
                _projectsRepository = projectsRepository;
                _issueTypeRepository = issueTypeRepository;
                _issueStatusRepository = issueStatusRepository;
                _usersRepository = usersRepository;
                _issuePriorityRepository = issuePriorityRepository;
                _issueGroupRepository = issueGroupRepository;
                _userOnIssueRepository = userOnIssueRepository;
                _issueNotificationService = issueNotificationService;
                _notificationsRepository = notificationsRepository;
                _issueCommentRepository = issueCommentRepository;
        }

        [HttpGet("issueId")]
        public async Task<ActionResult<JIssueDto>> GetIssueById(int issueId)
        {
            var issue = await _issueRepository.GetIssueById(issueId);

            var issueType = await _issueTypeRepository.GetIssueTypeById(issue.TypeId);
            var issuePriority = await _issuePriorityRepository.GetIssuePriorityById(issue.PriorityId);
            var issueStatus = await _issueStatusRepository.GetIssueStatusById(issue.StatusId);
            var issueGroup = await _issueGroupRepository.GetGroupAsync(issue.GroupId);
            var issueOwner = await _usersRepository.GetUserById(issue.OwnerId);
            var reporterId = await _issueRepository.GetReporterId(issue.Id);
            var reporterUsername = await _usersRepository.GetUserById(reporterId);
            var assigneeIds = await _issueRepository.GetAssigneeIds(issue.Id);
            var project = await _projectsRepository.GetProjectById(issueGroup.ProjectId);
            var issueDependencies = await _issueRepository.GetDependentIssues(issue.Id);

            var issuePredecessors = await _issueRepository.GetIssuePredecessors(issue.Id);
            var issueSuccessors = await _issueRepository.GetIssueSuccessors(issue.Id);

            var assigneeeCompletionLevel = await _issueRepository.GetAssigneeCompletionLevel(issue.Id);
            var comments = await _issueCommentRepository.GetCommentsForIssue(issue.Id);

            List<string> assigneeUsernames = new List<string>();
            foreach (var assignee in assigneeIds)
            {
                var user = await _usersRepository.GetUserById(assignee);
                assigneeUsernames.Add(user.UserName);
            }

            List<JCommentDto> commentDtos = new List<JCommentDto>();
            foreach (var item in comments)
            {
                var user = await _usersRepository.GetUserById(item.UserId);
                var userDto = new UserDto()
                {
                    Name = user.FirstName + ' ' + user.LastName,
                    Username = user.UserName
                };

                commentDtos.Add(new JCommentDto
                {
                    Id = item.Id,
                    IssueId = item.IssueId.ToString(),
                    UserId = item.UserId.ToString(),
                    Body = item.Content,
                    CreatedAt = item.Created.ToString(),
                    UpdatedAt = item.Created.ToString(),
                    User = userDto
                });
            }

            JIssueDto issueDto = new JIssueDto
            {
                Id = issue.Id.ToString(),
                Title = issue.Name,
                Type = issueType.Name,
                Status = issueStatus.Name,
                Priority = issuePriority.Name,
                ListPosition = issue.ListPosition,
                Description = issue.Description,
                CreatedAt = issue.CreatedDate.ToString(),
                UpdatedAt = issue.UpdatedDate.ToString(),
                DueDate = issue.DueDate.ToString(),
                ReporterId = reporterId.ToString(),
                UserIds = assigneeIds.Select(x => x.ToString()).ToList(),
                UsersWithCompletion = assigneeeCompletionLevel.ToList(),
                Completed = issue.Completed,
                Comments = commentDtos,
                ProjectId = project.Id.ToString(),
                OwnerUsername = issueOwner.UserName,
                ProjectName = project.Name,
                GroupName = issueGroup.Name,
                ReporterUsername = reporterUsername.UserName,
                AssigneeUsernames = assigneeUsernames.ToArray(),
                DependentOnIssues = issueDependencies.ToArray(),
                GroupId = issueGroup.Id,
                Predecessors = issuePredecessors.Select(x => new IssueDependenciesGetter
                {
                    Id = x.Id,
                    Name = x.Name,
                    IsPredecessor = true,
                    ProjectName = project.Name,
                    GroupName = issueGroup.Name
                }).ToList(),
                Successors = issueSuccessors.Select(x => new IssueDependenciesGetter
                {
                    Id = x.Id,
                    Name = x.Name,
                    IsPredecessor = false,
                    ProjectName = project.Name,
                    GroupName = issueGroup.Name
                }).ToList()
            };
            
            return issueDto;
        }

        [HttpGet("groupId")]
        public async Task<ActionResult<IEnumerable<JIssueDto>>> GetIssuesFromGroupAsync(int groupId) 
        {
            var issues = await _issueRepository.GetAllIssuesForGivenGroup( groupId );
            List<JIssueDto> result = new List<JIssueDto>();

            foreach( var issue in issues )
            {
                var issueType = await _issueTypeRepository.GetIssueTypeById(issue.TypeId);
                var issuePriority = await _issuePriorityRepository.GetIssuePriorityById(issue.PriorityId);
                var issueStatus = await _issueStatusRepository.GetIssueStatusById(issue.StatusId);
                var issueGroup = await _issueGroupRepository.GetGroupAsync(issue.GroupId);
                var issueOwner = await _usersRepository.GetUserById(issue.OwnerId);
                var reporterId = await _issueRepository.GetReporterId(issue.Id);
                var reporterUsername = await _usersRepository.GetUserById(reporterId);
                var assigneeIds = await _issueRepository.GetAssigneeIds(issue.Id);
                var project = await _projectsRepository.GetProjectById(issueGroup.ProjectId);
                var issueDependencies = await _issueRepository.GetDependentIssues(issue.Id);

                var issuePredecessors = await _issueRepository.GetIssuePredecessors(issue.Id);
                var issueSuccessors = await _issueRepository.GetIssueSuccessors(issue.Id);

                var assigneeeCompletionLevel = await _issueRepository.GetAssigneeCompletionLevel(issue.Id);
                var comments = await _issueCommentRepository.GetCommentsForIssue(issue.Id);
                Console.WriteLine(issueDependencies);

                List<string> assigneeUsernames = new List<string>();
                foreach( var assignee in assigneeIds ) {
                    var user = await _usersRepository.GetUserById(assignee);
                    assigneeUsernames.Add(user.UserName);
                }

                List<JCommentDto> commentDtos = new List<JCommentDto>();
                foreach (var item in comments)
                {
                    var user = await _usersRepository.GetUserById(item.UserId);
                    var userDto = new UserDto()
                    {
                        Name = user.FirstName + ' ' + user.LastName,
                        Username = user.UserName
                    };

                    commentDtos.Add(new JCommentDto
                    {
                        Id = item.Id,
                        IssueId = item.IssueId.ToString(),
                        UserId = item.UserId.ToString(),
                        Body = item.Content,
                        CreatedAt = item.Created.ToString(),
                        UpdatedAt = item.Created.ToString(),
                        User = userDto
                    });
                }

                JIssueDto issueDto = new JIssueDto {
                    Id = issue.Id.ToString(),
                    Title = issue.Name,
                    Type = issueType.Name,
                    Status = issueStatus.Name,
                    Priority = issuePriority.Name,
                    ListPosition = issue.ListPosition,
                    Description = issue.Description,
                    CreatedAt = issue.CreatedDate.ToString(),
                    UpdatedAt = issue.UpdatedDate.ToString(),
                    DueDate = issue.DueDate.ToString(),
                    ReporterId = reporterId.ToString(),
                    UserIds = assigneeIds.Select(x => x.ToString()).ToList(),
                    UsersWithCompletion = assigneeeCompletionLevel.ToList(),
                    Completed = issue.Completed,
                    Comments = commentDtos,
                    ProjectId = project.Id.ToString(),
                    OwnerUsername = issueOwner.UserName,
                    ProjectName = project.Name,
                    GroupName = issueGroup.Name,
                    ReporterUsername = reporterUsername.UserName,
                    AssigneeUsernames = assigneeUsernames.ToArray(),
                    DependentOnIssues = issueDependencies.ToArray(),
                    GroupId = issueGroup.Id,
                    Predecessors = issuePredecessors.Select(x => new IssueDependenciesGetter {
                        Id = x.Id,
                        Name = x.Name,
                        IsPredecessor = true,
                        ProjectName = project.Name,
                        GroupName = issueGroup.Name
                    }).ToList(),
                    Successors = issueSuccessors.Select(x => new IssueDependenciesGetter {
                        Id = x.Id,
                        Name = x.Name,
                        IsPredecessor = false,
                        ProjectName = project.Name,
                        GroupName = issueGroup.Name
                    }).ToList()
                };
                result.Add(issueDto);
            }

            return Ok(result);
        }

        [HttpGet("projectName")]
        public async Task<ActionResult<IEnumerable<JIssueDto>>> GetAllIssuesForProject(string projectName)
        {
            var projectByName = await _projectsRepository.GetProjectByName(projectName);
            var groups = await _issueRepository.GetAllGroupsForGivenProject(projectByName.Id);
            List<JIssueDto> result = new List<JIssueDto>();

            foreach (var group in groups)
            {
                var issues = await _issueRepository.GetAllIssuesForGivenGroup(group.Id);

                foreach (var issue in issues) {
                    var issueType = await _issueTypeRepository.GetIssueTypeById(issue.TypeId);
                    var issuePriority = await _issuePriorityRepository.GetIssuePriorityById(issue.PriorityId);
                    var issueStatus = await _issueStatusRepository.GetIssueStatusById(issue.StatusId);
                    var issueGroup = await _issueGroupRepository.GetGroupAsync(issue.GroupId);
                    var issueOwner = await _usersRepository.GetUserById(issue.OwnerId);
                    var reporterId = await _issueRepository.GetReporterId(issue.Id);
                    var reporterUsername = await _usersRepository.GetUserById(reporterId);
                    var assigneeIds = await _issueRepository.GetAssigneeIds(issue.Id);
                    var project = projectByName;
                    var issueDependencies = await _issueRepository.GetDependentIssues(issue.Id);

                    var issuePredecessors = await _issueRepository.GetIssuePredecessors(issue.Id);
                    var issueSuccessors = await _issueRepository.GetIssueSuccessors(issue.Id);

                    var assigneeeCompletionLevel = await _issueRepository.GetAssigneeCompletionLevel(issue.Id);
                    var comments = await _issueCommentRepository.GetCommentsForIssue(issue.Id);

                    List<string> assigneeUsernames = new List<string>();
                    foreach (var assignee in assigneeIds) {
                        var user = await _usersRepository.GetUserById(assignee);
                        assigneeUsernames.Add(user.UserName);
                    }

                    List<JCommentDto> commentDtos = new List<JCommentDto>();
                    foreach (var item in comments)
                    {
                        var user = await _usersRepository.GetUserById(item.UserId);
                        var userDto = new UserDto()
                        {
                            Name = user.FirstName + ' ' + user.LastName,
                            Username = user.UserName
                        };

                        commentDtos.Add(new JCommentDto
                        {
                            Id = item.Id,
                            IssueId = item.IssueId.ToString(),
                            UserId = item.UserId.ToString(),
                            Body = item.Content,
                            CreatedAt = item.Created.ToString(),
                            UpdatedAt = item.Created.ToString(),
                            User = userDto
                        });
                    }

                    JIssueDto issueDto = new JIssueDto {
                        Id = issue.Id.ToString(),
                        Title = issue.Name,
                        Type = issueType.Name,
                        Status = issueStatus.Name,
                        Priority = issuePriority.Name,
                        ListPosition = issue.ListPosition,
                        Description = issue.Description,
                        CreatedAt = issue.CreatedDate.ToString(),
                        UpdatedAt = issue.UpdatedDate.ToString(),
                        DueDate = issue.DueDate.ToString(),
                        ReporterId = reporterId.ToString(),
                        UserIds = assigneeIds.Select(x => x.ToString()).ToList(),
                        UsersWithCompletion = assigneeeCompletionLevel.ToList(),
                        Completed = issue.Completed,
                        Comments = commentDtos,
                        ProjectId = project.Id.ToString(),
                        OwnerUsername = issueOwner.UserName,
                        ProjectName = project.Name,
                        GroupName = issueGroup.Name,
                        ReporterUsername = reporterUsername.UserName,
                        AssigneeUsernames = assigneeUsernames.ToArray(),
                        DependentOnIssues = issueDependencies.ToArray(),
                        GroupId = issueGroup.Id,
                        Predecessors = issuePredecessors.Select(x => new IssueDependenciesGetter
                        {
                            Id = x.Id,
                            Name = x.Name,
                            IsPredecessor = true,
                            ProjectName = project.Name,
                            GroupName = issueGroup.Name
                        }).ToList(),
                        Successors = issueSuccessors.Select(x => new IssueDependenciesGetter
                        {
                            Id = x.Id,
                            Name = x.Name,
                            IsPredecessor = false,
                            ProjectName = project.Name,
                            GroupName = issueGroup.Name
                        }).ToList()
                    };
                    result.Add(issueDto);
                }
            }

            return Ok(result);
        }

        [HttpGet("userIssues")]
        public async Task<ActionResult<IEnumerable<JIssueDto>>> GetIssuesForUser(string username)
        {
            var user = await _usersRepository.GetUserByUsername(username);
            if(user == null)
            {
                return BadRequest(new { message = "User not found" });
            }

            var issues = await _userOnIssueRepository.UserIssuess(user.Id);
            List<JIssueDto> result = new List<JIssueDto>();

            foreach (var issue in issues)
            {
                var issueType = await _issueTypeRepository.GetIssueTypeById(issue.TypeId);
                var issuePriority = await _issuePriorityRepository.GetIssuePriorityById(issue.PriorityId);
                var issueStatus = await _issueStatusRepository.GetIssueStatusById(issue.StatusId);
                var issueGroup = await _issueGroupRepository.GetGroupAsync(issue.GroupId);
                var issueOwner = await _usersRepository.GetUserById(issue.OwnerId);
                var reporterId = await _issueRepository.GetReporterId(issue.Id);
                var reporterUsername = await _usersRepository.GetUserById(reporterId);
                var assigneeIds = await _issueRepository.GetAssigneeIds(issue.Id);
                var project = await _projectsRepository.GetProjectById(issueGroup.ProjectId);
                var issueDependencies = await _issueRepository.GetDependentIssues(issue.Id);

                var issuePredecessors = await _issueRepository.GetIssuePredecessors(issue.Id);
                var issueSuccessors = await _issueRepository.GetIssueSuccessors(issue.Id);

                var assigneeeCompletionLevel = await _issueRepository.GetAssigneeCompletionLevel(issue.Id);
                var comments = await _issueCommentRepository.GetCommentsForIssue(issue.Id);

                List<string> assigneeUsernames = new List<string>();
                foreach (var assignee in assigneeIds)
                {
                    var assigneeUser = await _usersRepository.GetUserById(assignee);
                    assigneeUsernames.Add(assigneeUser.UserName);
                }

                List<JCommentDto> commentDtos = new List<JCommentDto>();
                foreach (var item in comments)
                {
                    var user1 = await _usersRepository.GetUserById(item.UserId);
                    var userDto = new UserDto()
                    {
                        Name = user1.FirstName + ' ' + user1.LastName,
                        Username = user1.UserName
                    };

                    commentDtos.Add(new JCommentDto
                    {
                        Id = item.Id,
                        IssueId = item.IssueId.ToString(),
                        UserId = item.UserId.ToString(),
                        Body = item.Content,
                        CreatedAt = item.Created.ToString(),
                        UpdatedAt = item.Created.ToString(),
                        User = userDto
                    });
                }

                JIssueDto issueDto = new JIssueDto
                {
                    Id = issue.Id.ToString(),
                    Title = issue.Name,
                    Type = issueType.Name,
                    Status = issueStatus.Name,
                    Priority = issuePriority.Name,
                    ListPosition = issue.ListPosition,
                    Description = issue.Description,
                    CreatedAt = issue.CreatedDate.ToString(),
                    UpdatedAt = issue.UpdatedDate.ToString(),
                    DueDate = issue.DueDate.ToString(),
                    ReporterId = reporterId.ToString(),
                    UserIds = assigneeIds.Select(x => x.ToString()).ToList(),
                    UsersWithCompletion = assigneeeCompletionLevel.ToList(),
                    Completed = issue.Completed,
                    Comments = commentDtos,
                    ProjectId = project.Id.ToString(),
                    OwnerUsername = issueOwner.UserName,
                    ProjectName = project.Name,
                    GroupName = issueGroup.Name,
                    ReporterUsername = reporterUsername.UserName,
                    AssigneeUsernames = assigneeUsernames.ToArray(),
                    DependentOnIssues = issueDependencies.ToArray(),
                    GroupId = issueGroup.Id,
                    Predecessors = issuePredecessors.Select(x => new IssueDependenciesGetter
                    {
                        Id = x.Id,
                        Name = x.Name,
                        IsPredecessor = true,
                        ProjectName = project.Name,
                        GroupName = issueGroup.Name
                    }).ToList(),
                    Successors = issueSuccessors.Select(x => new IssueDependenciesGetter
                    {
                        Id = x.Id,
                        Name = x.Name,
                        IsPredecessor = false,
                        ProjectName = project.Name,
                        GroupName = issueGroup.Name
                    }).ToList()
                };
                result.Add(issueDto);
            }

            return Ok(result);
        }

        [HttpGet("pagination/projectName")]
        public async Task<ActionResult<IEnumerable<JIssueDto>>> GetPaginationIssuesForProject(string projectName, string criteria)
        {
            var projectByName = await _projectsRepository.GetProjectByName(projectName);
            var groups = await _issueRepository.GetAllGroupsForGivenProject(projectByName.Id);
            List<JIssueDto> issueDtos = new List<JIssueDto>();
            IssueLazyLoadDto lazyLoadDto = new IssueLazyLoadDto();

            Criteria criteriaObj = JsonConvert.DeserializeObject<Criteria>(criteria);

            var result = await _issueRepository.GetPaginationIssuesForProject(projectByName.Id,criteriaObj);

            foreach (var issue in result.issues)
            {
                var issueType = await _issueTypeRepository.GetIssueTypeById(issue.TypeId);
                var issuePriority = await _issuePriorityRepository.GetIssuePriorityById(issue.PriorityId);
                var issueStatus = await _issueStatusRepository.GetIssueStatusById(issue.StatusId);
                var issueGroup = await _issueGroupRepository.GetGroupAsync(issue.GroupId);
                var issueOwner = await _usersRepository.GetUserById(issue.OwnerId);
                var reporterId = await _issueRepository.GetReporterId(issue.Id);
                var reporterUsername = await _usersRepository.GetUserById(reporterId);
                var assigneeIds = await _issueRepository.GetAssigneeIds(issue.Id);
                var project = await _projectsRepository.GetProjectById(issueGroup.ProjectId);
                var issueDependencies = await _issueRepository.GetDependentIssues(issue.Id);

                var issuePredecessors = await _issueRepository.GetIssuePredecessors(issue.Id);
                var issueSuccessors = await _issueRepository.GetIssueSuccessors(issue.Id);

                var assigneeeCompletionLevel = await _issueRepository.GetAssigneeCompletionLevel(issue.Id);
                var comments = await _issueCommentRepository.GetCommentsForIssue(issue.Id);
                Console.WriteLine(issueDependencies);

                List<string> assigneeUsernames = new List<string>();
                foreach (var assignee in assigneeIds)
                {
                    var user = await _usersRepository.GetUserById(assignee);
                    assigneeUsernames.Add(user.UserName);
                }

                List<JCommentDto> commentDtos = new List<JCommentDto>();
                foreach (var item in comments)
                {
                    var user = await _usersRepository.GetUserById(item.UserId);
                    var userDto = new UserDto()
                    {
                        Name = user.FirstName + ' ' + user.LastName,
                        Username = user.UserName
                    };

                    commentDtos.Add(new JCommentDto
                    {
                        Id = item.Id,
                        IssueId = item.IssueId.ToString(),
                        UserId = item.UserId.ToString(),
                        Body = item.Content,
                        CreatedAt = item.Created.ToString(),
                        UpdatedAt = item.Created.ToString(),
                        User = userDto
                    });
                }

                JIssueDto issueDto = new JIssueDto
                {
                    Id = issue.Id.ToString(),
                    Title = issue.Name,
                    Type = issueType.Name,
                    Status = issueStatus.Name,
                    Priority = issuePriority.Name,
                    ListPosition = issue.ListPosition,
                    Description = issue.Description,
                    CreatedAt = issue.CreatedDate.ToString(),
                    UpdatedAt = issue.UpdatedDate.ToString(),
                    DueDate = issue.DueDate.ToString(),
                    ReporterId = reporterId.ToString(),
                    UserIds = assigneeIds.Select(x => x.ToString()).ToList(),
                    UsersWithCompletion = assigneeeCompletionLevel.ToList(),
                    Completed = issue.Completed,
                    Comments = commentDtos,
                    ProjectId = project.Id.ToString(),
                    OwnerUsername = issueOwner.UserName,
                    ProjectName = project.Name,
                    GroupName = issueGroup.Name,
                    ReporterUsername = reporterUsername.UserName,
                    AssigneeUsernames = assigneeUsernames.ToArray(),
                    DependentOnIssues = issueDependencies.ToArray(),
                    GroupId = issueGroup.Id,
                    Predecessors = issuePredecessors.Select(x => new IssueDependenciesGetter
                    {
                        Id = x.Id,
                        Name = x.Name,
                        IsPredecessor = true,
                        ProjectName = project.Name,
                        GroupName = issueGroup.Name
                    }).ToList(),
                    Successors = issueSuccessors.Select(x => new IssueDependenciesGetter
                    {
                        Id = x.Id,
                        Name = x.Name,
                        IsPredecessor = false,
                        ProjectName = project.Name,
                        GroupName = issueGroup.Name
                    }).ToList()
                };
                issueDtos.Add(issueDto);
            }

            lazyLoadDto.Issues = issueDtos;
            lazyLoadDto.NumberOfRecords = result.numberOfRecords;

            return Ok(lazyLoadDto);
        }

        [HttpPost]
        public async Task<ActionResult> CreateIssueInsideGroup(IssueCreationDto creationModel) 
        {
            var issueName = creationModel.Name;
            var issueType = await _issueTypeRepository.GetIssueTypeByName(creationModel.TypeName);
            var issueStatus = await _issueStatusRepository.GetIssueStatusByName(creationModel.StatusName);
            var issuePriority = await _issuePriorityRepository.GetIssuePriorityByName(creationModel.PriorityName);
            var issueDescription = creationModel.Description != null ? creationModel.Description : "";
            var issueCreatedDate = creationModel.CreatedDate;
            var issueUpdatedDate = creationModel.UpdatedDate;
            var issueDueDate = creationModel.DueDate;
            var issueOwner = await _usersRepository.GetUserByUsername(creationModel.OwnerUsername);
            var project = await _projectsRepository.GetProjectByName(creationModel.ProjectName);
            var issueGroup = await _issueGroupRepository.GetGroupByNameAsync(project.Id, creationModel.GroupName);
            if(issueGroup == null)
            {
                return BadRequest(new { message = "Group not found" });
            }
            var completed = 0.0;

            var issueReporter = await _usersRepository.GetUserByUsername(creationModel.ReporterUsername);

            // Prevodjenje username - ova iz niza assignees u njihove id-jeve
            var assignedToIds = await _usersRepository.GetUsersFromIDarray(creationModel.AssigneeUsernames);
            
            if(issueCreatedDate < project.CreationDate)
            {
                return BadRequest(new { message = "A task cannot be created because its creation date is before the project creation date" });
            }

            var created = await _issueRepository.CreateIssueAsync(
                new Issue {
                    Name = issueName,
                    TypeId = issueType.Id,
                    StatusId = issueStatus.Id,
                    PriorityId = issuePriority.Id,
                    Description = issueDescription,
                    CreatedDate = issueCreatedDate,
                    UpdatedDate = issueUpdatedDate,
                    DueDate = issueDueDate,
                    OwnerId = issueOwner.Id,
                    GroupId = issueGroup.Id,
                    Completed = completed
                }
            );

            if (created == null) 
            {
                return BadRequest(new { message = "There is already a task with the same name in this group" });
            }

            List<UsersOnIssue> usersToInsert = new List<UsersOnIssue>();
            List<string> usernames = new List<string>();

            usersToInsert.Add(new UsersOnIssue
            {
                UserId = issueReporter.Id,
                IssueId = created.Id,
                Reporting = true,
                CompletionLevel = 0.0
            });
            usernames.Add(issueReporter.UserName);

            foreach (var assigneeId in assignedToIds)
            {

                usersToInsert.Add(new UsersOnIssue
                {
                    UserId = assigneeId.Id,
                    IssueId = created.Id,
                    Reporting = false,
                    CompletionLevel = 0.0
                });
                usernames.Add(assigneeId.UserName);
            }

            await _userOnIssueRepository.AddUserOnIssue(usersToInsert);

            // posalji norifikaciju da je kreiran zadatak
            usernames.RemoveAll(u => u == issueOwner.UserName); // ko kreira zadatak ne mora da dobija notifikaciju
            await _issueNotificationService.NotifyUsers(usernames.ToArray(), created.Name);

            // dodaj notifikacije u tabelu Notifications
            // [Id] [UserId] [Message] [DateCreated]
            List<Notification> notifications = new List<Notification>();
            foreach(var user in usersToInsert) {

                if (user.UserId == issueOwner.Id) continue; // onome ko je kreirao notifikaciju ne saljemo notifikaciju

                string messageContent = "" +
                    "<h4>🆕 You have been assigned a new task</h4>" +
                    "<span style='background: red;'><strong>Due Date: </strong>" + created.DueDate.ToLongDateString() + "</span>" + 
                    "<br>" +
                    "<strong>Project: </strong>" + project.Name +
                    "<br>" +
                    "<strong>Group: </strong>" + issueGroup.Name +
                    "<br>" + 
                    "<strong>Task Name: </strong>" + created.Name +
                    "<br>" +
                    "<strong>Assignee/Reporter: </strong>";
                if(user.Reporting) {
                    messageContent += "Reporter";
                }
                else {
                    messageContent += "Assignee";
                }
                
                notifications.Add(new Notification {
                    UserId = user.UserId,
                    Message = messageContent,
                    DateCreated = DateTime.Now
                });
            }
            await _notificationsRepository.AddNotificationRangeAsync(notifications);

            List<Tuple<int, int>> dependenciesToInsert = new List<Tuple<int, int>>();
            if(creationModel.DependentOnIssues != null) {
                foreach (var dependentOnIssueId in creationModel.DependentOnIssues) {
                    Tuple<int, int> e = new Tuple<int, int>(created.Id, dependentOnIssueId);
                    dependenciesToInsert.Add(e);
                }


            }

            return Ok();
        }

        [HttpPut("issueId")]
        public async Task<IActionResult> UpdateIssueStartEndDate(int issueId, IssueUpdateDatesDto updateDate) {
            var updated = await _issueRepository.UpdateIssueStartEndDate(issueId, updateDate);
            if(updated == false) {
                return BadRequest("Not valid call");
            }
            return Ok();
        }

        [HttpPut("kb/{issueId}")]
        public async Task<IActionResult> UpdateIssue(int issueId, JIssueDto bodyRequest)
        {
            var updated = await _issueRepository.UpdateIssue(issueId, bodyRequest);
            if (updated == false)
            {
                return BadRequest("Not valid call");
            }
            return Ok();
        }


        /// <summary>
        /// Endpoint koji upisuje novog korisnika na issue
        /// </summary>
        /// <param name="issueId"></param>
        /// <param name="bodyRequest"></param>
        /// <returns> novi completed nivo na celom zadatku </returns>
        [HttpPost("update-uoi/{issueId}")]
        public async Task<IActionResult> UpdateUsersOnIssue(int issueId, UsersOnIssueDto bodyRequest)
        {
            var updated = await _issueRepository.UpdateUsersOnIssue(issueId, bodyRequest);
            if (updated < 0)
            {
                return BadRequest("Not valid call");
            }
            return Ok(updated);
        }

        [HttpPut("update-cl/{issueId}")]
        public async Task<IActionResult> UpdateAssigneeCompletionLevel(int issueId, UsersOnIssueDto usersOnIssueDto)
        {
            var updated = await _issueRepository.UpdateAssigneeCompletionLevel(issueId, usersOnIssueDto);
            if (updated < 0)
            {
                return BadRequest("Not valid call");
            }
            return Ok(updated);
        }

        [HttpDelete("delete-issue/{issueId}")]
        public async Task<IActionResult> DeleteIssue(int issueId) {
            var deleted = await _issueRepository.DeleteIssue(issueId);
            if(deleted != "OK") {
                return BadRequest(new { message = deleted });
            }
            return Ok();
        }

        [HttpDelete("delete-uoi/{issueId}/{userId}")]
        public async Task<IActionResult> UpdateUsersOnIssue(int issueId, string userId)
        {
            var updated = await _issueRepository.DeleteUserOnIssue(issueId, userId);
            if (updated < 0)
            {
                return BadRequest("Not valid call");
            }
            return Ok(updated);
        }

        [HttpPut]
        public async Task<IActionResult> CreateOrDeleteDependency(IssueDependenciesUpdateDto model) {
            var changed = await _issueRepository.CreateOrDeleteDependency(model);
            return Ok();
        }

        [HttpGet("{issueId}/ProjectName")]
        public async Task<ActionResult> GetProjectNameFromIssueId(int issueId)
        {
            var projectName = await _issueRepository.GetProjectNameByIssueId(issueId);

            if (projectName == null || !projectName.Any())
            {
                return NotFound("No project name found for the given issue ID.");
            }

            return Ok(new { projectName });
        }
    }
}
