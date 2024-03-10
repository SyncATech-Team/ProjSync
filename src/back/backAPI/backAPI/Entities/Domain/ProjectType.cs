using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain {
    [Table("ProjectTypes")]
    public class ProjectType {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
