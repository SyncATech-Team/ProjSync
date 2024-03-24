using backAPI.Data;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation
{
    public class NotificationRepository : INotificationsRepository
    {
        private readonly DataContext dataContext;
        public async Task<Notification> AddNotificationAsync(Notification notification)
        {
            await dataContext.Notifications.AddAsync(notification);
            await dataContext.SaveChangesAsync();

            return notification;
        }

        public async Task<Boolean> DeleteNotificationAsync(int id)
        {
            var notification = await dataContext.Notifications.FindAsync(id);

            if (notification == null)
            {
                return false;
            }

            dataContext.Notifications.Remove(notification);
            await dataContext.SaveChangesAsync(true);

            return true;
        }

        public async Task<IEnumerable<Notification>> GetAllNotificationsAsync()
        {
            return await dataContext.Notifications.ToListAsync();
        }

        public async Task<Notification> GetNotificationByIdAsync(int id)
        {
            return await dataContext.Notifications.SingleOrDefaultAsync(notification => notification.Id == id);
        }

        public async Task<Notification> GetNotificationByUserIdAsync(int userId)
        {
            return await dataContext.Notifications.SingleOrDefaultAsync(notification => notification.UserId == userId);
        }
    }
}
