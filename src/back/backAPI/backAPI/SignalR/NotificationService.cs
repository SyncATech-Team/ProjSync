using backAPI.DTO.Chat;
using Microsoft.AspNetCore.SignalR;

namespace backAPI.SignalR {
    public class NotificationService {

        private static readonly Dictionary<string, List<string>> ConnectedUsers
            = new Dictionary<string, List<string>>();

        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationService(IHubContext<NotificationHub> hubContext) {
            _hubContext = hubContext;
        }

        public Task UserConnected(string username, string connectionId) {
            // Dictionary nije thread safe, tako da ako ima vise user-a koji
            // pokusavaju da pristupe, morace da sacekaju
            lock (ConnectedUsers) {
                if (ConnectedUsers.ContainsKey(username)) {
                    ConnectedUsers[username].Add(connectionId);
                }
                else {
                    ConnectedUsers.Add(username, new List<string> { connectionId });
                }
            }

            return Task.CompletedTask;
        }

        public Task UserDisconnected(string username, string connectionId) {
            lock (ConnectedUsers) {
                if (!ConnectedUsers.ContainsKey(username)) {
                    return Task.CompletedTask;
                }

                ConnectedUsers[username].Remove(connectionId);

                // mozda je neko zakacen sa vise uredjaja ( pa ce da ima drugaciji id konekcije )
                if (ConnectedUsers[username].Count == 0) {
                    ConnectedUsers.Remove(username);
                }
            }

            return Task.CompletedTask;
        }

        public async Task NotifyUsers(string[] usernames, string message) {
            foreach (var onlineUser in ConnectedUsers) {
                var onlineUserUsername = onlineUser.Key;
                var onlineUserConnectionIds = onlineUser.Value;

                // If the online user is not in the list of usernames, skip
                if (!usernames.Contains(onlineUserUsername)) continue;

                await _hubContext.Clients.Clients(onlineUserConnectionIds).SendAsync("ReceiveNotification", message);
                Console.WriteLine(onlineUserUsername);
            }
        }

        public async Task SendChatMessageNotification(string[] usernames, ChatMessageDto message) {
            foreach (var onlineUser in ConnectedUsers) {
                var onlineUserUsername = onlineUser.Key;
                var onlineUserConnectionIds = onlineUser.Value;

                // If the online user is not in the list of usernames, skip
                if (!usernames.Contains(onlineUserUsername)) continue;

                await _hubContext.Clients.Clients(onlineUserConnectionIds).SendAsync("ReceiveChatMessage", message);
                Console.WriteLine(onlineUserUsername);
            }
        }


    }
}
