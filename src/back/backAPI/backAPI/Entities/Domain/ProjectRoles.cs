using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain
{
    [Table("ProjectRoles")]
    public class ProjectRoles
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public int RoleLevel { get; set; }
    }
}
