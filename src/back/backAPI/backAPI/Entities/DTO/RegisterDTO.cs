using System.ComponentModel.DataAnnotations;

namespace backAPI.Entities.DTO
{
    /// <summary>
    /// Za registraciju korisnika koristice se ovaj DTO kao objekat koji ce API da prihvati
    /// </summary>
    public class RegisterDTO
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }

        [Required]
        public string UserEmail { get; set; }

        [Required]
        public string UserFirstName { get; set; }

        [Required]
        public string UserLastName { get; set; }

        [Required]
        public int RoleCompany { get; set; }

        public string UserAddress { get; set; }
        public string UserContactPhone { get; set; }
        public string UserLinkedinProfile { get; set; }
        public string UserStatus { get; set; }
    }
}
