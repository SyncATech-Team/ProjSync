using System.ComponentModel.DataAnnotations;

namespace backAPI.DTOs
{
    /// <summary>
    /// Za registraciju korisnika koristice se ovaj DTO kao objekat koji ce API da prihvati
    /// </summary>
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
