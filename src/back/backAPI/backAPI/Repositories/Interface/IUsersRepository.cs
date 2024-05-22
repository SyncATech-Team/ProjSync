using backAPI.DTO;
using backAPI.Entities.Domain;
using backAPI.Other.Helpers;

namespace backAPI.Repositories.Interface
{
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
        /// Funkcija koja za prosledjeni email vraca korisnika
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        Task<User> GetUserByEmail(string email);

        /// <summary>
        /// Funkcija koja za prosledjeni username vraca korisnika
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        Task<User> GetUserByUsername(string username);

        /// <summary>
        /// Funkcija koja za prosledjeni id vraca korisnika
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<User> GetUserById(int id);

        /// <summary>
        /// Funkcija koja za prosledjeni id korisnika brise njegove podatke iz baze
        /// </summary>
        /// <param name="id"></param>
        /// <returns>true u slucaju da je brisanje uspesno, false u suprotnom</returns>
        Task<bool> DeleteUser(string username);

        /// <summary>
        /// Funkcija koja update-uje podatke korisnika
        /// </summary>
        /// <param name="username"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        Task<string> UpdateUser(string username, UserDto user);

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

        Task<string> IdToUsername(int id);

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

        Task UpdateUserProfilePhoto(string username, string photoURL);

        Task<IEnumerable<User>> GetUsersFromIDarray(string[] arr);

        Task<(IEnumerable<User> users, int numberOfRecords)> GetPaginationAllUsersAsync(Criteria criteria);
        Task<string> UpdateUserPreferedTheme(string username, string theme);
    }
}
