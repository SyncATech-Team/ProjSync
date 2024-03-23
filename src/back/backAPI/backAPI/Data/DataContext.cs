using backAPI.Entities.Domain;
using backAPI.Other.Logger;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Task = backAPI.Entities.Domain.Task;

namespace backAPI.Data
{
    public class DataContext : IdentityDbContext<User, AppRole, int,
        IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>,
        IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        // Log queries to console :)
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
            optionsBuilder.UseLoggerFactory(LoggerFactory.Create(builder => builder.AddProvider(new ColoredConsoleLoggerProvider())));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) 
        {
            base.OnModelCreating(modelBuilder);


            // FK Company role in User
            modelBuilder.Entity<User>()
                .HasOne(u => u.CompanyRole)                 // User has one CompanyRole
                .WithMany()                                 // Inverse relationship (optional, for clarity)
                .HasForeignKey(u => u.CompanyRoleId)
                .OnDelete(DeleteBehavior.Restrict);         // Restrict deletion if a User is referenced by a CompanyRole

            /* **************************************************************************
             * Strani kljucevi u tabeli Project
             * ************************************************************************** */
            modelBuilder.Entity<Project>()
                .HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Project>()
                .HasOne(p => p.ProjectType)
                .WithMany()
                .HasForeignKey(p => p.TypeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Project>()
                .HasOne(p => p.ProjectParent)
                .WithMany()
                .HasForeignKey(p => p.ParentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Project>()
                .HasOne(p => p.ProjectVisibility)
                .WithMany()
                .HasForeignKey(p => p.VisibilityId)
                .OnDelete(DeleteBehavior.Restrict);

            /* **************************************************************************
             * Strani kljucevi u tabeli Task
             * ************************************************************************** */
            modelBuilder.Entity<Task>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Task>()
                .HasOne(t => t.Project)
                .WithMany()
                .HasForeignKey(t => t.ProjectId)
                .OnDelete(DeleteBehavior.Restrict);
            
            modelBuilder.Entity<Task>()
                .HasOne(t => t.TaskPriority)
                .WithMany()
                .HasForeignKey(t => t.PriorityId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Task>()
                .HasOne(t => t.TaskType)
                .WithMany()
                .HasForeignKey(t => t.TypeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Task>()
                .HasOne(t => t.DependentTask)
                .WithMany()
                .HasForeignKey(t => t.DependentOn)
                .OnDelete(DeleteBehavior.Restrict);
            

            modelBuilder.Entity<AppRole>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(u => u.Role)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();

            // UNIQUE Company role name
            modelBuilder.Entity<CompanyRole>()
                .HasIndex(c => c.Name)
                .IsUnique(true);

            // UNIQUE task type name
            modelBuilder.Entity<TaskType>()
                .HasIndex(t => t.Name)
                .IsUnique(true);

            // UNIQUE task priority name
            modelBuilder.Entity<TaskPriority>()
                .HasIndex(t => t.Name)
                .IsUnique(true);

            // UNIQUE project key
            modelBuilder.Entity<Project>()
                .HasIndex(t => t.Key)
                .IsUnique(true);

            // UNIQUE project roles name
            modelBuilder.Entity<ProjectRoles>()
                .HasIndex(r => r.Name)
                .IsUnique(true);

            // UNIQUE project type name
            modelBuilder.Entity<ProjectType>()
                .HasIndex(t => t.Name)
                .IsUnique(true);

            // UNIQUE visibility name
            modelBuilder.Entity<ProjectVisibility>()
                .HasIndex(t => t.Name)
                .IsUnique(true);
        }

        public DbSet<CompanyRole> CRoles { get; set; }
        public DbSet<WorkingHours> WorkHours { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectVisibility> ProjectVisibilities { get; set; }
        public DbSet<ProjectType> ProjectTypes { get; set; }
        public DbSet<Task> Tasks { get; set; }
        public DbSet<TaskType> TaskTypes { get; set; }
        public DbSet<TaskPriority> TaskPriority { get; set; }
        public DbSet<ProjectRoles> ProjectRoles { get; set; }
        public DbSet<UsersOnTasks> UsersOnTasks { get; set; }
        public DbSet<UsersOnProject> UsersOnProjects { get; set; }
        public DbSet<ProjectDocumentation> ProjectDocumentation { get; set; }
        public DbSet<TaskComment> TaskComment { get; set; }
        public DbSet<Notification> Notifications { get; set; }
    }
}
