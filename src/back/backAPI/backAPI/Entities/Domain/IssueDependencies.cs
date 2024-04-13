using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain {
    [Table("IssueDependencies")]
    public class IssueDependencies {
        public int Id { get; set; }
        public int OriginId { get; set; }   // od kog zadatka se povlaci veza
        public int TargetId { get; set; }   // ka kom zadatku se povlaci veza



        [ForeignKey("OriginId")] public Issue Origin { get; set; }
        [ForeignKey("TargetId")] public Issue Target { get; set; }
    }
}
