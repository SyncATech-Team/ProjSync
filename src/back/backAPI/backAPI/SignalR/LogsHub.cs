using Microsoft.AspNetCore.SignalR;

namespace backAPI.SignalR {
    public class LogsHub : Hub {

        // Korisnik otvorio summary stranicu
        public override async Task OnConnectedAsync() {
            await LogsService.UserConnected(Context.User.Identity.Name, Context.ConnectionId);
        }

        // Korisnik zatvorio summary stranicu
        public override async Task OnDisconnectedAsync(Exception exception) {
            await LogsService.UserDisconnected(Context.User.Identity.Name, Context.ConnectionId);
        }


    }
}
