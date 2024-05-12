namespace backAPI.DTO {
    public class LogDto {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string Message { get; set; }
        public DateTime DateCreated { get; set; }
    }
}
