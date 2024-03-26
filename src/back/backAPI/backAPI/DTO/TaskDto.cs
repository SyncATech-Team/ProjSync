namespace backAPI.DTO {
    public class TaskDto {
        public int Id { get; set; }
        public string Name { get; set; }
        public int TypeId { get; set; }
        public int StatusId { get; set; }
        public int PriorityId { get; set; }
        public string Description { get; set; }
        
        public int Estimate { get; set; }  // ?
        public int TimeSpent { get; set; }
        public int TimeRemaining { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public DateTime DueDate { get; set; }
        public int ReporterId { get; set; }
        public int GroupId { get; set; }
        public int? DependentOn { get; set; }
    }
}
