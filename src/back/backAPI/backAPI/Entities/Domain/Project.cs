using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace backAPI.Entities.Domain
{
    [Table("Projects")]
    public class Project
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Key { get; set; }
        public int TypeId { get; set; }
        public string Description { get; set; }
        public int OwnerId { get; set; }
        public string IconPath { get; set; }
        public int? ParentId { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime DueDate { get; set; }
        public double? Budget { get; set; } = 0.0;
        public int VisibilityId { get; set; }


        [ForeignKey("TypeId")]
        public ProjectType ProjectType { get; set; }

        [ForeignKey("OwnerId")]
        public User User { get; set; }

        [ForeignKey("ParentId"), AllowNull]
        public Project ProjectParent { get; set; }

        [ForeignKey("VisibilityId")]
        public ProjectVisibility ProjectVisibility { get; set; }

    }
}
