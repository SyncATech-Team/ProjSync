using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain {
    [Table("Tasks")]
    public class Task {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        [Required]
        public DateTime DueDate { get; set; }
        public string Description { get; set; }
        [ForeignKey("Users")]
        public int CreatedBy { get; set; }
        [ForeignKey("Projects")]
        public int ProjectId { get; set; }
        public int DependentOn { get; set; }
        [ForeignKey("TaskPriority")]
        public int PriorityId { get; set; }
        [ForeignKey("TaskType")]
        public int TypeId { get; set; }
    }
}
