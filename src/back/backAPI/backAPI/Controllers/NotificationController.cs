using backAPI.Entities.Domain;
using backAPI.Repositories.Implementation;
using backAPI.Repositories.Interface;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace backAPI.Controllers
{
    public class NotificationController : BaseApiController
    {
        public readonly INotificationsRepository notificationsRepository;

        //KONSTRUKTOR
        public NotificationController(INotificationsRepository notificationRepository)
        {
            this.notificationsRepository = notificationsRepository;   
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Notification>>> GetAllNotification()
        {
            List<Notification> notifications = new List<Notification>();

            var notifys = await notificationsRepository.GetAllNotificationsAsync();

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
