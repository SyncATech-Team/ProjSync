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
        Task<Notification> GetNotificationByUserIdAsync(int userId);

        Task<int> GetNumberOfNotificationsForUserAsync(int userId);

        //DODAVANJE NOVE NOTIFIKACIJE
        Task<IEnumerable<Notification>> AddNotificationRangeAsync(IEnumerable<Notification> notifications);

        //BRISANJE NOTIFIKACIJE PO ID
        Task<Boolean> DeleteNotificationAsync(int id);
    }
}
