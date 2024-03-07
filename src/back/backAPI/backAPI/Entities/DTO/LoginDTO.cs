using System.ComponentModel.DataAnnotations;

namespace backAPI.Entities.DTO
{
    /// <summary>
    /// Za login korisnika koristice se ovaj DTO kao objekat koji ce API da prihvati
    /// </summary>
    public class LoginDTO
    {
        [Required]
        public string UserEmail { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
