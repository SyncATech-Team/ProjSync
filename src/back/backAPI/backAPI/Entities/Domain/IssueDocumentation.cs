using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain
{
    [Table("IssueDocumentation")]
    public class IssueDocumentation
    {
        public int Id { get; set; }
        public string Title {  get; set; }
        public string Path {  get; set; }
        public int IssueId {  get; set; }
        public DateTime DateUploaded { get; set; }

        [ForeignKey("IssueId")] public Issue Issue { get; set; }
    }
}
