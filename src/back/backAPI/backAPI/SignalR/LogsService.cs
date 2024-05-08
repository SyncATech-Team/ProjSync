using Microsoft.AspNetCore.SignalR;

namespace backAPI.SignalR {
    public class LogsService {

        private static readonly Dictionary<string, List<string>> ConnectedUsers
            = new Dictionary<string, List<string>>();

        private readonly IHubContext<LogsHub> _hubContext;

        public LogsService(IHubContext<LogsHub> hubContext) {
            _hubContext = hubContext;
        }

        public static Task UserConnected(string username, string connectionId) {
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

        public static Task UserDisconnected(string username, string connectionId) {
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

    }
}
