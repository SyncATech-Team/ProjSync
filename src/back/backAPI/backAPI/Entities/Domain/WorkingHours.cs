using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace backAPI.Entities.Domain {

    [Table("WorkingHours")]
    public class WorkingHours {
        [Key]
        [ForeignKey("Users")]
        [Column(Order = 1)]
        public int UserId { get; set; }
        [Column (Order = 2)]
        public DateTime SpecificDate { get; set; }
        [Required, NotNull]
        public double HoursWorking {  get; set; }
        
        public bool? Weekend { get; set; } = false;
        
        public bool? Overtime { get; set; } = false;
    }
}
