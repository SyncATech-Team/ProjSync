using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain {
    [Table("ProjectVisibilities")]
    public class ProjectVisibility {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
