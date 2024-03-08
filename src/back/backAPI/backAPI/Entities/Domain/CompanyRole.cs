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
        public int Id { get; set; }
        public string Name { get; set; }
        public double WorkingHourPrice { get; set; }
        public double OvertimeHourPrice { get; set; }
        public double WeekendHourPrice { get; set; }
    }
}
