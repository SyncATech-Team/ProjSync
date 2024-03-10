using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain {
    [Table("TaskComments")]
    public class TaskComment {
        [Key]
        public int Id { get; set; }
        [ForeignKey("Users")]
        public int UserId { get; set; }
        [ForeignKey("Tasks")]
        public int TaskId { get; set; }
        public int Parent {  get; set; }
        public string Content { get; set; }
        [Required]
        public DateTime Created { get; set; }
    }
}
