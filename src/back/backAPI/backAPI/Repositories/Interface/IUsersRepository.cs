using backAPI.Entities.Domain;
using backAPI.DTO;

namespace backAPI.Repositories.Interface {
    public interface IUsersRepository {

        /// <summary>
        /// Funkcija koja dovlaci sve korisnike koji su registrovani u oragnizaciji
        /// </summary>
        /// <returns></returns>
        Task<IEnumerable<User>> GetUsersAsync();

        /// <summary>
        /// Funkcija za upisvanje novog korisnika u bazu podataka
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        Task<User> RegisterUser(User user);

        /// <summary>
        /// Funkcija koja za prosledjeni id vraca korisnika
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        Task<User> GetUser(string email);

        /// <summary>
        /// Funkcija koja za prosledjeni id korisnika brise njegove podatke iz baze
        /// </summary>
        /// <param name="id"></param>
        /// <returns>true u slucaju da je brisanje uspesno, false u suprotnom</returns>
        Task<bool> DeleteUser(int id);

        /// <summary>
        /// Funkcija koja odredjuje id za prosledjeno korisnicko ime
        /// </summary>
        /// <param name="username"></param>
        /// <returns>
        /// Id korisnika ili -1 ukoliko ne postoji korisnik sa prosledjenim korisnickim imenom
        /// </returns>
        Task<int> UsernameToId(string username);

        /// <summary>
        /// Funkcija koja odredjuje id za prosledjeni email
        /// </summary>
        /// <param name="email"></param>
        /// <returns>
        /// Id korisnika ili -1 ukoliko ne postoji korisnik sa prosledjenim email-om
        /// </returns>
        Task<int> EmailToId(string email);

        /// <summary>
        /// Provera da li korisnik postoji sa istim korisnickim imenom
        /// </summary>
        /// <param name="username"></param>
        /// <returns>
        /// True - ukoliko korisnik postoji sa ovim korisnickim imenom, False suprotno
        /// </returns>
        Task<bool> UserExistsByUsername(string username);

        /// <summary>
        /// Provera da li korisnik postoji sa istim email-om
        /// </summary>
        /// <param name="email"></param>
        /// <returns>
        /// True - ukoliko korisnik postoji sa ovim email-om, False suprotno
        /// </returns>
        Task<bool> UserExistsByEmail(string email);
    }
}
