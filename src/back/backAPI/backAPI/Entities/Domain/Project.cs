using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace backAPI.Entities.Domain {
    [Table("Projects")]
    public class Project {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Key { get; set; }
        [ForeignKey("ProjectType")]
        public int TypeId { get; set; }
        public string Description { get; set; }
        [ForeignKey("User")]
        public int OwnerId {  get; set; }
        public string IconPath { get; set; }
        [ForeignKey("Project"), AllowNull]
        public int? ParentId { get; set; }
        [Required]
        public DateTime CreationDate { get; set; }
        [Required]
        public DateTime DueDate { get; set; }
        public double? Budget { get; set; } = 0.0;
        [ForeignKey("ProjectVisibility")]
        public int VisibilityId { get; set; }
    }
}
