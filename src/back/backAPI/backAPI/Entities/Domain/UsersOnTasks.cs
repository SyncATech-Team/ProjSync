using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain {
    [Table("UsersOnTasks")]
    public class UsersOnTasks {
        [Key]
        public int Id { get; set; }
        [ForeignKey("Users")]
        public int UserId { get; set; }
        [ForeignKey("Tasks")]
        public int TaskId { get; set; }
        public bool Reporting { get; set; } = false;
        [Required]
        public double CompletionLevel { get; set; } = 0.0;
    }
}
