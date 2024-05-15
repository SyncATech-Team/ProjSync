using backAPI.Data;
using backAPI.DTO;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation
{
    public class NotificationRepository : INotificationsRepository
    {
        private readonly DataContext _dataContext;

        public NotificationRepository(DataContext dataContext) {
            _dataContext = dataContext;
        }

        public async Task<IEnumerable<Notification>> AddNotificationRangeAsync(IEnumerable<Notification> notifications)
        {
            Console.WriteLine("Called");
            await _dataContext.Notifications.AddRangeAsync(notifications);
            await _dataContext.SaveChangesAsync();

            return notifications;
        }

        public async Task<bool> DeleteNotificationAsync(int id)
        {
            var notification = await _dataContext.Notifications.FindAsync(id);

            if (notification == null)
            {
                return false;
            }

            _dataContext.Notifications.Remove(notification);
            await _dataContext.SaveChangesAsync(true);

            return true;
        }

        public async Task<IEnumerable<Notification>> GetAllNotificationsAsync()
        {
            return await _dataContext.Notifications.ToListAsync();
        }

        public async Task<Notification> GetNotificationByIdAsync(int id)
        {
            return await _dataContext.Notifications.SingleOrDefaultAsync(notification => notification.Id == id);
        }

        public async Task<List<NotificationDto>> GetUserNotifications(int userId)
        {
            var notifications = await _dataContext.Notifications.ToListAsync();
            var filtered = notifications.Where(notification => notification.UserId == userId);

            List<NotificationDto> notificationDtos = new List<NotificationDto>();
            foreach(var notification in filtered) {
                notificationDtos.Add(new NotificationDto {
                    Id = notification.Id,
                    UserId = notification.UserId,
                    Message = notification.Message,
                    DateCreated = notification.DateCreated
                });
            }
            return notificationDtos;
        }
        public async Task<int> GetNumberOfNotificationsForUserAsync(int userId) {
            var filtered = await _dataContext.Notifications.ToListAsync();
            
            if (filtered.Any() == false) return 0;

            return filtered.Where(notification => notification.UserId == userId).Count();
        }

        public async Task<bool> DeleteUsersNotificationsAsync(int userId) {
            var filtered = await _dataContext.Notifications.Where(
                    notification => notification.UserId == userId
                ).ToListAsync();

            _dataContext.Notifications.RemoveRange(filtered);
            await _dataContext.SaveChangesAsync();

            return true;
        }
    }
}
