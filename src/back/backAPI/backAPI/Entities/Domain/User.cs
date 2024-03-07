using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain
{
    /// <summary>
    /// Entitet u bazi koji predstavlja korisnika aplikacije
    /// </summary>

    [Table("Users")]
    public class User
    {
        [Key]
        public int UserId { get; set; }                         // PK | Automatski generisan id korisnika
        [Required]
        public string Username { get; set; }                    // Jedinstveno korisnicko ime
        [Required]
        public byte[] PasswordHash { get; set; }                // Hash vrednost lozinke koju je korisnik uneo
        [Required]
        public byte[] PasswordSalt { get; set; }                // Izmena hash-a za sifru
        [Required]
        public string UserEmail { get; set; }                   // Email adresa korisnika
        [Required]
        public string UserFirstName { get; set; }               // Ime zaposlenog
        [Required]
        public string UserLastName { get; set; }                // Prezime zaposlenog
        [ForeignKey("CompanyRoles")]
        public int RoleCompany { get; set; }                    // FK | Uloga u kompaniji/radno mesto
        
        public string UserProfilePhoto { get; set; }            // Ukoliko postoji, slika korisnika
        public string UserAddress { get; set; }                 // Ukoliko postoji, adresa korisnika
        public string UserContactPhone { get; set; }            // Ukoliko postoji, broj telefona korisnika
        public string UserLinkedinProfile { get; set; }         // Ukoliko postoji, link do LinkedIn profila
        public string UserStatus { get; set; }                  // Ukoliko postoji, licni status korisnika
    }
}
