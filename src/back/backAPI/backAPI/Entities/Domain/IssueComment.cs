using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain
{
    [Table("IssueComments")]
    public class IssueComment
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public int IssueId { get; set; }
        public int Parent { get; set; }
        public string Content { get; set; }
        public DateTime Created { get; set; }

        [ForeignKey("UserId")] public User User { get; set; }
        [ForeignKey("IssueId")] public Issue Issue { get; set; }
    }
}
