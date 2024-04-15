using System.ComponentModel.DataAnnotations;

namespace backAPI.DTO.Issues 
{
    /// <summary>
    /// Objekat koji kontroler prihvata kada zelimo da kreiramo zadatak
    /// </summary>
    public class IssueCreationDto 
    {
        [Required] public string Name { get; set; }
        [Required] public string TypeName { get; set; }
        [Required] public string StatusName { get; set; }
        [Required] public string PriorityName { get; set; }
        public string Description { get; set; }
        [Required] public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        [Required] public DateTime DueDate { get; set; }
        [Required] public string OwnerUsername { get; set; }
        [Required] public string ReporterUsername { get; set; }
        public string[] AssigneeUsernames { get; set; }

        public int[] DependentOnIssues { get; set; }

        [Required] public string ProjectName { get; set; }
        [Required] public string GroupName { get; set; }

        public double Completed {  get; set; }
    }
}
