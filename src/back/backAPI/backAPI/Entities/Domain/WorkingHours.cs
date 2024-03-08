using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain {

    [Table("WorkingHours")]
    public class WorkingHours {
        [Key]
        [ForeignKey("Users")]
        [Column(Order = 1)]
        public int UserId { get; set; }
        [Column (Order = 2)]
        public DateTime SpecificDate { get; set; }
        public double HoursWorking {  get; set; }
        [DefaultValue(false)]
        public bool Weekend { get; set; }
        [DefaultValue(false)]
        public bool Overtime { get; set; }
    }
}
