using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain
{
    [Table("UsersOnTasks")]
    public class UsersOnTasks {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public int TaskId { get; set; }
        public bool Reporting { get; set; } = false;
        public double CompletionLevel { get; set; } = 0.0;

        [ForeignKey("UserId")] public User User { get; set; }
        [ForeignKey("TaskId")] public Issue Task { get; set; }
    }
}
