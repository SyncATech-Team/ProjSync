using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace backAPI.Entities.Domain
{

    [Table("WorkingHours")]
    public class WorkingHours
    {
        [Key]
        [Column(Order = 1)]
        public int UserId { get; set; }
        [Column(Order = 2)]
        public DateTime SpecificDate { get; set; }
        public double HoursWorking { get; set; }

        [ForeignKey("UserId")] public User User { get; set; }
    }
}
