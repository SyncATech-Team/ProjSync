using Microsoft.AspNetCore.SignalR;

namespace backAPI.SignalR
{
    public class PresenceTracker
    {
        private static readonly Dictionary<string, List<string>> OnLineUsers 
            = new Dictionary<string, List<string>>();

        private readonly IHubContext<PresenceHub> _hubContext;

        public PresenceTracker(IHubContext<PresenceHub> hubContext) {
            _hubContext = hubContext;
        }

        public Task UserConnected(string username, string connectionId)
        {
            // Dictionary nije thread safe, tako da ako ima vise user-a koji
            // pokusavaju da pristupe, morace da sacekaju
            lock (OnLineUsers)
            {
                if (OnLineUsers.ContainsKey(username))
                {
                    OnLineUsers[username].Add(connectionId);
                }
                else
                {
                    OnLineUsers.Add(username, new List<string>{connectionId});
                }
            }

            return Task.CompletedTask;
        }

        public Task UserDisconnected(string username, string connectionId)
        {
            lock(OnLineUsers)
            {
                if (!OnLineUsers.ContainsKey(username))
                {
                    return Task.CompletedTask;
                }

                OnLineUsers[username].Remove(connectionId);

                // mozda je neko zakacen sa vise uredjaja ( pa ce da ima drugaciji id konekcije )
                if (OnLineUsers[username].Count == 0)
                {
                    OnLineUsers.Remove(username);
                }
            }

            return Task.CompletedTask;
        }

        public Task<string[]> GetOnlineUsers()
        {
            string[] onlineUsers;
            lock (OnLineUsers)
            {
                onlineUsers = OnLineUsers.OrderBy(k => k.Key).Select(k => k.Key).ToArray();
            }

            return Task.FromResult(onlineUsers);
        }

        public Task<Dictionary<string, List<string>>> GetConnectionIdsOfAnUser(string username) {
            Dictionary<string, List<string>> returnValue = new Dictionary<string, List<string>>();
            lock (OnLineUsers) {
                returnValue = OnLineUsers.Where(ou => ou.Key == username).ToDictionary();
            }

            return Task.FromResult(returnValue);
        }

        public async Task OnAccountDeactivation(string username) {
            var userObject = await GetConnectionIdsOfAnUser(username);
            if (userObject.ContainsKey(username) != false) { // ako ovaj user nije konektovan nece se pokretati ovaj postupak
                var connectionIds = userObject[username];
                await _hubContext.Clients.Clients(connectionIds).SendAsync("AccountDeactivated");

                /*lock (OnLineUsers) {
                    OnLineUsers.Remove(username);
                }*/
            }
            else {
                Console.WriteLine("User not connected on any device. No need to force logout");
            }
        }

    }
}
