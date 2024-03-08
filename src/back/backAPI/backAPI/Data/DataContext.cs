using backAPI.Entities.Domain;
using backAPI.Other.Logger;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        // Log queries to console :)
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
            optionsBuilder.UseLoggerFactory(LoggerFactory.Create(builder => builder.AddProvider(new ColoredConsoleLoggerProvider())));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            
            // TABLE: User | COLUMN: Username | Unique constraint 
            modelBuilder.Entity<User>()
                .HasIndex(user => user.Username)
                .IsUnique();

            // TABLE: User | COLUMN: UserEmail | Unique constraint
            modelBuilder.Entity<User>()
                .HasIndex(user => user.UserEmail)
                .IsUnique();

            // TABLE: RoleCompany | COLUMN: RoleCompanyName | Unique constraint
            modelBuilder.Entity<CompanyRole>()
                .HasIndex(roleCompany => roleCompany.RoleCompanyName)
                .IsUnique();

        }

        public DbSet<User> Users { get; set; }
        public DbSet<CompanyRole> Roles { get; set; }
        public DbSet<WorkingHours> WorkHours { get; set; }
    }
}
