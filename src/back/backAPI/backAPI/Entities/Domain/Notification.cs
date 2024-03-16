using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Runtime.InteropServices;

namespace backAPI.Entities.Domain
{
    [Table("Notifications")]
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        [Required, NotNull]
        public int User_Id { get; set; }

        [Required, NotNull]
        public string Message { get; set; }

        [Required, NotNull]
        public DateTime DateCreated { get; set; }
    }
}
