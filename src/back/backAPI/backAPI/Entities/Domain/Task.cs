namespace backAPI.Entities.Domain {
    public class Task {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public DateTime DueDate { get; set; }
        public string Description { get; set; }
        public int CreatedBy { get; set; }
        public int ProjectId { get; set; }
        public int DependentOn { get; set; }
        public int PriorityId { get; set; }
        public int TypeId { get; set; }
    }
}
