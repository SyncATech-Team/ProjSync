using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain
{
    [Table("UsersOnProjects")]
    public class UsersOnProject {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ProjectId { get; set; }

        [ForeignKey("UserId")] public User User { get; set; }
        [ForeignKey("ProjectId")] public Project Project { get; set; }
    }
}
