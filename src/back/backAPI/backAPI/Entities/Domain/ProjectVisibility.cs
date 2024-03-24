using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain
{
    [Table("ProjectVisibilities")]
    public class ProjectVisibility
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
