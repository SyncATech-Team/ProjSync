namespace backAPI.Entities
{
    /// <summary>
    /// Entitet u bazi koji predstavlja korisnika aplikacije
    /// </summary>
    public class AppUser
    {
        // Id automatski generisan // [Key]
        public int Id { get; set; }

        // username koji ce da se koristi za login
        public string UserName { get; set; }

        // hash sifre koji je korisnik uneo
        public byte[] PasswordHash { get; set; }

        // izmena hash-a za sifru
        public byte[] PasswordSalt { get; set; }
    }
}
