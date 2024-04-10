using Microsoft.AspNetCore.Identity;

namespace backAPI.Entities.Domain
{
    public class AppRole : IdentityRole<int>
    {
        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}
