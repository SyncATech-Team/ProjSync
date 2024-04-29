using backAPI.DTO;
using backAPI.Entities.Domain;
using backAPI.Repositories.Implementation;
using backAPI.Repositories.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
    public class NotificationController : BaseApiController
    {
        private readonly INotificationsRepository _notificationsRepository;
        private readonly IUsersRepository _usersRepository;

        //KONSTRUKTOR
        public NotificationController(
            INotificationsRepository notificationRepository,
            IUsersRepository usersRepository
        )
        {
            _notificationsRepository = notificationRepository;
            _usersRepository = usersRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Notification>>> GetAllNotification()
        {
            List<Notification> notifications = new List<Notification>();

            var notifys = await _notificationsRepository.GetAllNotificationsAsync();

            if (notifys == null)
                return BadRequest("There are no comany roles to fetch");

            foreach (var notify in notifys)
            {
                notifications.Add(notify);
            }

            return notifications;
        }

        [HttpGet("user/{username}/count")]
        public async Task<ActionResult<int>> GetNotificationCountForUser(string username) {
            var user = await _usersRepository.GetUserByUsername(username);
            if (user == null) {
                return NotFound("User not found");
            }

            var count = await _notificationsRepository.GetNumberOfNotificationsForUserAsync(user.Id);
            return count;
        }

        [HttpGet("user/{username}/notifications")]
        public async Task<ActionResult<IEnumerable<NotificationDto>>> GetNotificationsForUser(string username) {
            var user = await _usersRepository.GetUserByUsername(username);
            if (user == null) {
                return NotFound("User not found");
            }

            var result = await _notificationsRepository.GetUserNotifications(user.Id);
            return result;
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteNotificationById(int id) {
            var deleted = await _notificationsRepository.DeleteNotificationAsync(id);
            if(deleted == false) {
                return BadRequest("Unable to delete notification");
            }

            return Ok();
        }

        [HttpDelete("deleteforuser/{username}")]
        public async Task<ActionResult> DeleteUserNotifications(string username) {
            var user = await _usersRepository.GetUserByUsername(username);
            if (user == null) {
                return NotFound("User not found");
            }

            var deleted = await _notificationsRepository.DeleteUsersNotificationsAsync(user.Id);

            if(deleted == false) {
                return BadRequest("Unable to delete notifications");
            }

            return Ok();
        }

    }
}
