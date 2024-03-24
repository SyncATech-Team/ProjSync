using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain
{
    public class GroupsOnProject {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public int ProjectId { get; set; }

        [ForeignKey("GroupId")] public TaskGroup TaskGroup { get; set; }
        [ForeignKey("ProjectId")] public Project Project { get; set; }

    }
}
