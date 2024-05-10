using backAPI.Data;
using backAPI.DTO;
using backAPI.DTO.Issues;
using backAPI.Entities.Domain;
using backAPI.Repositories.Implementation;
using backAPI.Repositories.Implementation.Issues;
using backAPI.Repositories.Interface;
using backAPI.Repositories.Interface.Issues;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backAPI.SignalR
{
    [Authorize]
    public class CommentsHub : Hub
    {
        private readonly IIssueCommentRepository _issueCommentRepository;
        private readonly IUsersRepository _usersRepository;
        private readonly DataContext _dataContext;
        private readonly IIssueRepository _issueRepository;
        private readonly NotificationService _notificationService;
        private readonly INotificationsRepository _notificationsRepository;
        public CommentsHub(IIssueCommentRepository issueCommentRepository,
            DataContext dataContext, IUsersRepository usersRepository,
            IIssueRepository issueRepository,
            NotificationService notificationService,
            INotificationsRepository notificationsRepository)
        {
            _issueCommentRepository = issueCommentRepository;
            _usersRepository = usersRepository;
            _dataContext = dataContext;
            _issueRepository = issueRepository;
            _notificationService = notificationService;
            _notificationsRepository = notificationsRepository;
        }

        public async override Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();

            var issueId = Int32.Parse(httpContext.Request.Query["issueId"]);
            await Groups.AddToGroupAsync(Context.ConnectionId, issueId.ToString());

            var comments = await _issueCommentRepository.GetCommentsForIssue(issueId);
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
            await Clients.Group(issueId.ToString()).SendAsync("ReceiveComments", commentDtos);
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            return base.OnDisconnectedAsync(exception);
        }

        public async Task CreateCommentOnIssue(JCommentDto commentDto)
        {
            if (await _issueCommentRepository.CreateCommentsOnIssue(commentDto))
            {
                var issue = await _issueRepository.GetIssueById(Convert.ToInt32(commentDto.IssueId));
                
                List<string> usernames = new List<string>();

                var commentor = await _usersRepository.GetUserById(Convert.ToInt32(commentDto.UserId));
                var issueReporter = await _usersRepository.GetUserById(issue.OwnerId);
                var assigneeIds = await _issueRepository.GetAssigneeIds(issue.Id);
                usernames.Add(issueReporter.UserName);

                foreach (var assigneeId in assigneeIds)
                {
                    usernames.Add(await _usersRepository.IdToUsername(assigneeId));
                }

                usernames.RemoveAll(u => u == commentor.UserName);
                await _notificationService.NotifyUsers(usernames.ToArray(), issue.Name);


                List<Notification> notifications = new List<Notification>();
                string messageContent = "" +
                        "<h4>🆕 New comment on your task</h4>" +
                        "<strong>Task: </strong>" + issue.Name +
                        "<br>" +
                        "<strong>User: </strong>" + commentor.FirstName + " " + commentor.LastName +
                        "<br>" +
                        "<strong>Date: </strong>" + commentDto.CreatedAt ;

                foreach (var assigneeId in assigneeIds)
                {

                    if (assigneeId == commentor.Id) continue;

                    notifications.Add(new Notification
                    {
                        UserId = assigneeId,
                        Message = messageContent,
                        DateCreated = DateTime.Now
                    });
                }
                if(issueReporter.UserName !=  commentor.UserName && !assigneeIds.Contains(issueReporter.Id) )
                {
                    notifications.Add(new Notification
                    {
                        UserId = issueReporter.Id,
                        Message = messageContent,
                        DateCreated = DateTime.Now
                    });
                }

                await _notificationsRepository.AddNotificationRangeAsync(notifications);


                var user = await _usersRepository.GetUserById(Int32.Parse(commentDto.UserId));
                var userDto = new UserDto()
                {
                    Name = user.FirstName + ' ' + user.LastName,
                    Username = user.UserName
                };

                var comment = new JCommentDto
                {
                    Id = commentDto.Id,
                    IssueId = commentDto.IssueId,
                    UserId = commentDto.UserId,
                    Body = commentDto.Body,
                    CreatedAt = commentDto.CreatedAt,
                    UpdatedAt = commentDto.UpdatedAt,
                    User = userDto
                };
                await Clients.Group(commentDto.IssueId).SendAsync("CreateComment", comment);
            }
        }
    }
}
