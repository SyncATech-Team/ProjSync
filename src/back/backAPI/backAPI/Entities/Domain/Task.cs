using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain
{
    [Table("Tasks")]
    public class Task
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public DateTime DueDate { get; set; }
        public string Description { get; set; }
        public int CreatedBy { get; set; }
        public int GroupId { get; set; }
        public int? DependentOn { get; set; }
        public int PriorityId { get; set; }
        public int TypeId { get; set; }



        [ForeignKey("CreatedBy")]
        public User User { get; set; }


        [ForeignKey("GroupId")]
        public TaskGroup TaskGroup { get; set; }


        [ForeignKey("PriorityId")]
        public TaskPriority TaskPriority { get; set; }


        [ForeignKey("TypeId")]
        public TaskType TaskType { get; set; }


        [ForeignKey("DependentOn")]
        public Task DependentTask { get; set; }

    }
}
