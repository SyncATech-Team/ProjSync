namespace backAPI.DTO
{
    public class NotificationDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Message { get; set; }
        public DateTime DateCreated { get; set; }
    }
}
