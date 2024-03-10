namespace backAPI.Entities.Domain {
    public class TaskComment {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int TaskId { get; set; }
        public int Parent {  get; set; }
        public string Content { get; set; }
        public DateTime Created { get; set; }
    }
}
