using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain
{
    [Table("Issues")]
    public class Issue
    {
        [Key] public int Id { get; set; }
        [Required] public string Name { get; set; }
        public int TypeId { get; set; }
        public int StatusId { get; set; }
        public int PriorityId { get; set; }
        public string Description { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public DateTime DueDate { get; set; }
        public int ReporterId { get; set; }
        public int AssigneeId { get; set; }
        public int GroupId { get; set; }
        public int? DependentOn { get; set; }
        
        [ForeignKey("StatusId")] public IssueStatus IssueStatus { get; set; }

        [ForeignKey("ReporterId")] public User User { get; set; }

        [ForeignKey("GroupId")] public IssueGroup IssueGroup { get; set; }

        [ForeignKey("PriorityId")] public IssuePriority IssuePriority { get; set; }

        [ForeignKey("TypeId")] public IssueType IssueType { get; set; }

        [ForeignKey("DependentOn")] public Issue DependentIssue { get; set; }

    }
}
