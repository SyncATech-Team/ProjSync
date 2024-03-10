using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace backAPI.Entities.Domain
{
    /// <summary>
    /// Entitet u bazi koji predstavlja korisnika aplikacije
    /// </summary>

    [Table("Users")]
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required, NotNull]
        public string Username { get; set; }
        [Required, NotNull]
        public byte[] PasswordHash { get; set; }
        [Required, NotNull]
        public byte[] PasswordSalt { get; set; }
        [Required, NotNull]
        public string Email { get; set; }
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
    }
}
