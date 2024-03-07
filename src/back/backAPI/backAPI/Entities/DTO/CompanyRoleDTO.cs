using System.ComponentModel.DataAnnotations;

namespace backAPI.Entities.DTO {
    public class CompanyRoleDTO {
        [Required]
        public string RoleCompanyName { get; set; }
        [Required]
        public double WorkingHourPrice { get; set; }
        [Required]
        public double OvertimeHourPrice { get; set; }
        [Required]
        public double WeekendHourPrice { get; set; }
    }
}
