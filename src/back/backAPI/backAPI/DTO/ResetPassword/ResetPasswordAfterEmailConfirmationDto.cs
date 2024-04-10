using System.ComponentModel.DataAnnotations;

namespace backAPI.DTO.ResetPassword
{
    public class ResetPasswordAfterEmailConfirmationDto
    {
        public string Token { get; set; }
        public string Email { get; set; }
    }
}
