using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

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
        [Required, NotNull]
        public string Name { get; set; }
        [Required, NotNull]
        public double WorkingHourPrice { get; set; }
        [Required, NotNull]
        public double OvertimeHourPrice { get; set; }
        [Required, NotNull]
        public double WeekendHourPrice { get; set; }
    }
}
