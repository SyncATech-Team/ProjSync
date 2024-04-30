using Microsoft.AspNetCore.SignalR;

namespace backAPI.SignalR {
    public class NotificationHub : Hub {

        private readonly NotificationService _notificationService;

        public NotificationHub(NotificationService issueNotificationService) { 
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
