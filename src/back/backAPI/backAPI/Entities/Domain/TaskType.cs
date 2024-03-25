using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain
{
    [Table("TaskTypes")]
    public class TaskType
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
