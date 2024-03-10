using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain {
    [Table("ProjectTypes")]
    public class ProjectType {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
    }
}
