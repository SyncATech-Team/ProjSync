using backAPI.Entities.Domain;
using backAPI.Repositories.Implementation;
using backAPI.Repositories.Interface;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace backAPI.Controllers
{
    public class NotificationController : BaseApiController
    {
        public readonly INotificationsRepository _notificationsRepository;

        //KONSTRUKTOR
        public NotificationController(INotificationsRepository notificationRepository)
        {
            _notificationsRepository = notificationRepository;
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
    }
}
