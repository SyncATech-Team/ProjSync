namespace backAPI.DTO.Issues
{
    /// <summary>
    /// Objekat koji backend vraca na front
    /// </summary>
    public class IssueDto {
        public int Id { get; set; }
        public string Name { get; set; }
        public string TypeName { get; set; }
        public string StatusName { get; set; }
        public string PriorityName { get; set; }
        public string Description { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public DateTime DueDate { get; set; }
        public string OwnerUsername { get; set; }
        public string ProjectName { get; set; }
        public string GroupName { get; set; }
        public string ReporterUsername { get; set; }
        public string[] AssigneeUsernames { get; set; }
        public int[] DependentOnIssues { get; set; }
        public double Completed {  get; set; }
        public int GroupId { get; set; }            // za dovlacenje grupe
    }
}
