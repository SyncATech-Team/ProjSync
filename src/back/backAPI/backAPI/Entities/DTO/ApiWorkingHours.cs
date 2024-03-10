using System.ComponentModel.DataAnnotations;

namespace backAPI.Entities.DTO {
    public class ApiWorkingHours {

        public int UserId { get; set; }
        public DateTime SpecificDate { get; set; }
        public double HoursWorking { get; set; }
        public bool? Weekend { get; set; }
        public bool? Overtime { get; set; }

    }
}
