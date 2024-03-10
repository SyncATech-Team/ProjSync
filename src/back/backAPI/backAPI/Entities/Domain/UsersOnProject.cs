using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain {
    [Table("UsersOnProjects")]
    public class UsersOnProject {
        [Key]
        public int Id { get; set; }
        [ForeignKey("Users")]
        public int UserId { get; set; }
        [ForeignKey("Projects")]
        public int ProjectId { get; set; }
        [ForeignKey("ProjectRoles")]
        public int ProjectRole {  get; set; }
    }
}
