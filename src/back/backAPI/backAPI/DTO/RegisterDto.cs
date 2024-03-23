using System.ComponentModel.DataAnnotations;

namespace backAPI.DTO
{
    public class RegisterDto
    {
        /// <summary>
        /// Ime
        /// </summary>
        [Required]
        public string FirstName { get; set; }

        /// <summary>
        /// Prezime
        /// </summary>
        [Required]
        public string LastName { get; set; }
        
        /// <summary>
        /// Email adresa
        /// </summary>
        [Required]
        public string Email { get; set; }
        
        /// <summary>
        /// Korisnicko ime
        /// </summary>
        [Required]
        public string UserName { get; set; }
        
        /// <summary>
        /// Lozinka
        /// </summary>
        [Required]
        public string Password { get; set; }
        
        /// <summary>
        /// Naziv uloge u kompaniji
        /// </summary>
        [Required]
        public string CompanyRole { get; set; }
        
        /// <summary>
        /// Adresa
        /// </summary>
        public string Address { get; set; }
        
        /// <summary>
        /// Kontakt telefon
        /// </summary>
        public string ContactPhone { get; set; }
    }
}
