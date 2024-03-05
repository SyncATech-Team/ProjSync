using System.ComponentModel.DataAnnotations;

namespace backAPI.DTOs
{
    /// <summary>
    /// Za login korisnika koristice se ovaj DTO kao objekat koji ce API da prihvati
    /// </summary>
    public class LoginDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
