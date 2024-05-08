using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain {
    public class Log {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string Message { get; set; }
        public DateTime DateCreated { get; set; }

        [ForeignKey("ProjectId")] public Project Project { get; set; }
    }
}
