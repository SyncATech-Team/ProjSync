using Microsoft.AspNetCore.SignalR;

namespace backAPI.SignalR {
    public class NotificationHub : Hub {

        private readonly IssueNotificationService _notificationService;

        public NotificationHub(IssueNotificationService issueNotificationService) { 
            _notificationService = issueNotificationService;
        }

        public override async Task OnConnectedAsync() {
            await _notificationService.UserConnected(Context.User.Identity.Name, Context.ConnectionId);
        }

        public override async Task OnDisconnectedAsync(Exception exception) {
            await _notificationService.UserDisconnected(Context.User.Identity.Name, Context.ConnectionId);
        }

    }
}
