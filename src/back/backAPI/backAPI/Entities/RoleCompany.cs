using System.ComponentModel.DataAnnotations;

namespace backAPI.Entities {
    /// <summary>
    /// Entitet u bazi koji predstavlja definisane pozicije u kompaniji
    /// </summary>
    public class RoleCompany {
        [Key]
        public int RoleCompanyId { get; set; }              // Id uloge u kompaniji, primary key, autoincrement
        public string RoleCompanyName { get; set; }         // Jedinstveni naziv pozicije u kompaniji [direktor, menadzer, radnik, ...]
        public double WorkingHourPrice { get; set; }        // Cena rada po satu za odredjenu poziciju
        public double OvertimeHourPrice { get; set; }       // Cena prekovremenog rada
        public double WeekendHourPrice { get; set; }        // Cena rada vikendom
    }
}
