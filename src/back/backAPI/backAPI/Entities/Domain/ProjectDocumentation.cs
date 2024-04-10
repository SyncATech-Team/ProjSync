using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain
{
    [Table("ProjectDocumentations")]
    public class ProjectDocumentation
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Path { get; set; }
        public int ProjectId { get; set; }
        public DateTime DateUploaded { get; set; }

        [ForeignKey("ProjectId")] public Project Project { get; set; }
    }
}
