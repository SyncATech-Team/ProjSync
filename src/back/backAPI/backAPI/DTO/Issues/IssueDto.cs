namespace backAPI.DTO.Issues
{
    public class IssueDto
    {
        public string Name { get; set; }
        public string TypeName { get; set; }
        public string StatusName { get; set; }
        public string PriorityName { get; set; }
        public string Description { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public DateTime DueDate { get; set; }
        public string ReporterUsername { get; set; }
        public string AssignedTo { get; set; }
        public string GroupName { get; set; }
        public string ProjectName { get; set; }
        public int? DependentOn { get; set; } = -1;
    }
}
