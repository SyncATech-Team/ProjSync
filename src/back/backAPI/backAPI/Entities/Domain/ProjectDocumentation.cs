using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain {
    [Table("ProjectDocumentations")]
    public class ProjectDocumentation {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string Path { get; set; }
        [ForeignKey("Projects")]
        public int ProjectId { get; set; }
        [Required]
        public DateTime DateUploaded { get; set; }
    }
}
