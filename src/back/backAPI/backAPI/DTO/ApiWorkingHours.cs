using System.ComponentModel.DataAnnotations;

namespace backAPI.DTO
{
    public class ApiWorkingHours
    {

        public int UserId { get; set; }
        public DateTime SpecificDate { get; set; }
        public double HoursWorking { get; set; }

    }
}
