using backAPI.Data;
using backAPI.DTO;
using backAPI.DTO.Issues;
using backAPI.Repositories.Implementation;
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
        public CommentsHub(IIssueCommentRepository issueCommentRepository,
            DataContext dataContext, IUsersRepository usersRepository)
        {
            _issueCommentRepository = issueCommentRepository;
            _usersRepository = usersRepository;
            _dataContext = dataContext;
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
