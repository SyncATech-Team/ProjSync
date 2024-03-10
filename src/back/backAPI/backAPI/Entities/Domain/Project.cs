using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace backAPI.Entities.Domain {
    [Table("Projects")]
    public class Project {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Key { get; set; }
        [ForeignKey("ProjectType")]
        public int TypeId { get; set; }
        public string Description { get; set; }
        [ForeignKey("User")]
        public int OwnerId {  get; set; }
        public string IconPath { get; set; }
        [ForeignKey("Project"), AllowNull]
        public int ParentId { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime DueDate { get; set; }
        public double Budget { get; set; }
        [ForeignKey("ProjectVisibility")]
        public int VisibilityId { get; set; }
    }
}
