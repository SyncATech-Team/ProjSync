using backAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {

#region TABLE: User builder
            
            // TABLE: User | COLUMN: Username | Unique constraint 
            modelBuilder.Entity<User>()
                .HasIndex(user => user.Username)
                .IsUnique();

            // TABLE: User | COLUMN: UserEmail | Unique constraint
            modelBuilder.Entity<User>()
                .HasIndex(user => user.UserEmail)
                .IsUnique();

#endregion

#region TABLE: RoleCompany

            // TABLE: RoleCompany | COLUMN: RoleCompanyName | Unique constraint
            modelBuilder.Entity<RoleCompany>()
                .HasIndex(roleCompany => roleCompany.RoleCompanyName)
                .IsUnique();

#endregion


        }

        public DbSet<User> Users { get; set; }
        public DbSet<RoleCompany> Roles { get; set; }
    }
}
