using System.ComponentModel.DataAnnotations;

namespace backAPI.DTO
{
    public class RegisterDto
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string CompanyRole { get; set; }
        public string Address { get; set; }
        public string ContactPhone { get; set; }
        public string LinkedinProfile { get; set; }
        public string Status { get; set; }
    }
}
