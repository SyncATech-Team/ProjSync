using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Identity;

namespace backAPI.Entities.Domain
{
    /// <summary>
    /// Entitet u bazi koji predstavlja korisnika aplikacije
    /// </summary>

    [Table("Users")]
    public class User : IdentityUser<int>
    {
        [Required, NotNull]
        public string FirstName { get; set; }
        [Required, NotNull]
        public string LastName { get; set; }
        [ForeignKey("CompanyRoles")]
        public int CompanyRoleId { get; set; }
        public string ProfilePhoto { get; set; }
        public string Address { get; set; }
        public string ContactPhone { get; set; }
        public string LinkedinProfile { get; set; }
        public string Status { get; set; }
        public bool IsVerified { get; set; } = false;
        public string PreferedLanguage { get; set; } = "engish";
        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}
