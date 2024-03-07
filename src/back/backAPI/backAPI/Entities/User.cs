using System.ComponentModel.DataAnnotations;

namespace backAPI.Entities
{
    /// <summary>
    /// Entitet u bazi koji predstavlja korisnika aplikacije
    /// </summary>
    public class User
    {
        [Key]
        public int UserId { get; set; }                         // PK | Automatski generisan id korisnika
        public string Username { get; set; }                    // Jedinstveno korisnicko ime
        public byte[] PasswordHash { get; set; }                // Hash vrednost lozinke koju je korisnik uneo
        public byte[] PasswordSalt { get; set; }                // Izmena hash-a za sifru
        public string UserEmail { get; set; }                   // Email adresa korisnika
        public string UserFirstName { get; set; }               // Ime zaposlenog
        public string UserLastName { get; set; }                // Prezime zaposlenog
        public int RoleCompany { get; set; }                    // FK | Uloga u kompaniji/radno mesto
        public string UserProfilePhoto { get; set; }            // Ukoliko postoji, slika korisnika
        public string UserAddress { get; set; }                 // Ukoliko postoji, adresa korisnika
        public string UserContactPhone { get; set; }            // Ukoliko postoji, broj telefona korisnika
        public string UserLinkedinProfile {  get; set; }        // Ukoliko postoji, link do LinkedIn profila
        public string UserStatus { get; set; }                  // Ukoliko postoji, licni status korisnika
    }
}
