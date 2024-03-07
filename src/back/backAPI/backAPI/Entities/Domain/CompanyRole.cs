using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain
{
    /// <summary>
    /// Entitet u bazi koji predstavlja definisane pozicije u kompaniji
    /// </summary>
    /// 
    [Table("CompanyRoles")]
    public class CompanyRole
    {
        [Key]
        public int RoleCompanyId { get; set; }              // Id uloge u kompaniji, primary key, autoincrement
        [Required]
        public string RoleCompanyName { get; set; }         // Jedinstveni naziv pozicije u kompaniji [direktor, menadzer, radnik, ...]
        [Required]
        public double WorkingHourPrice { get; set; }        // Cena rada po satu za odredjenu poziciju
        [Required]
        public double OvertimeHourPrice { get; set; }       // Cena prekovremenog rada
        [Required]
        public double WeekendHourPrice { get; set; }        // Cena rada vikendom
    }
}
