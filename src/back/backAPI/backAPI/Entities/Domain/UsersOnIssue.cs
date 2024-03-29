using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain
{
    [Table("UsersOnIssues")]
    public class UsersOnIssue 
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public int IssueId { get; set; }
        public bool Reporting { get; set; } = false;
        public double CompletionLevel { get; set; } = 0.0;

        [ForeignKey("UserId")] public User User { get; set; }
        [ForeignKey("IssueId")] public Issue Issue { get; set; }
    }
}
