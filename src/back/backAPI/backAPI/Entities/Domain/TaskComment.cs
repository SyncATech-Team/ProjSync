using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain
{
    [Table("TaskComments")]
    public class TaskComment
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public int TaskId { get; set; }
        public int Parent { get; set; }
        public string Content { get; set; }
        public DateTime Created { get; set; }

        [ForeignKey("UserId")] public User User { get; set; }
        [ForeignKey("TaskId")] public Task Task { get; set; }
    }
}
