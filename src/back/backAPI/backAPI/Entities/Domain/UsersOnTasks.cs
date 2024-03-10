namespace backAPI.Entities.Domain {
    public class UsersOnTasks {
        public int UserId { get; set; }
        public int TaskId { get; set; }
        public bool Reporting { get; set; }
        public double CompletionLevel { get; set; }
    }
}
