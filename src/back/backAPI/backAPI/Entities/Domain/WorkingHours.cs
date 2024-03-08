using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain {

    [Table("WorkingHours")]
    public class WorkingHours {
        [Key] [Column(Order = 1)] public int UserId { get; set; }
        [Required] [Column (Order = 2)] public DateTime SpecificDate { get; set; }
        [Required] public double HoursWorking {  get; set; }
        [Required, DefaultValue(false)] public bool Weekend { get; set; }
        [Required, DefaultValue(false)] public bool Overtime { get; set; }
    }
}
