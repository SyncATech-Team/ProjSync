using System.ComponentModel.DataAnnotations;

namespace backAPI.Entities.DTO {
    public class WorkingHoursDTO {

        [Required] public int UserId { get; set; }
        [Required] public DateTime SpecificDate { get; set; }
        [Required] public double HoursWorking { get; set; }
        [Required] public bool Weekend { get; set; }
        [Required] public bool Overtime { get; set; }

    }
}
