using System.ComponentModel.DataAnnotations;

namespace backAPI.DTO.ResetPassword
{
    public class ForgotPasswordDto
    {
        [Required]
        public string Email { get; set; }
    }
}
