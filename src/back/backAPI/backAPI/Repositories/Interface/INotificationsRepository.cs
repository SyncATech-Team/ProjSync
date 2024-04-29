using backAPI.DTO;
using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface
{
    public interface INotificationsRepository
    {
        //DOVLACENJE SVIH NOTIFIKACIJA
        Task<IEnumerable<Notification>> GetAllNotificationsAsync();

        //DOVLACENJE NOTIFIKACIJE PO ID 
        Task<Notification> GetNotificationByIdAsync(int id);

        //DOVLACENJE NOTIFIKACIJE PO ID KORISNIKA
        Task<List<NotificationDto>> GetUserNotifications(int userId);

        Task<int> GetNumberOfNotificationsForUserAsync(int userId);

        //DODAVANJE NOVE NOTIFIKACIJE
        Task<IEnumerable<Notification>> AddNotificationRangeAsync(IEnumerable<Notification> notifications);

        //BRISANJE NOTIFIKACIJE PO ID
        Task<bool> DeleteNotificationAsync(int id);

        // BRISANJE SVIH NOTIFIKACIJA KOJE IMA KORISNIK
        Task<bool> DeleteUsersNotificationsAsync(int userId);
    }
}
