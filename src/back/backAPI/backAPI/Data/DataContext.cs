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

            /* *******************************************************************************************************************
             * *******************************************************************************************************************
             * *******************************************************************************************************************
             * SPECIFIKACIJA STRANIH KLJUCEVA
             * *******************************************************************************************************************
             * *******************************************************************************************************************
             * ******************************************************************************************************************* */

            /* **************************************************************************
             * Strani kljucevi u tabeli >> User <<
             * ************************************************************************** */
            modelBuilder.Entity<User>()
                .HasOne(u => u.CompanyRole)
                .WithMany()
                .HasForeignKey(u => u.CompanyRoleId)
                .OnDelete(DeleteBehavior.Restrict);

            /* **************************************************************************
             * Strani kljucevi u tabeli >> Project <<
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
             * Strani kljucevi u tabeli >> Task <<
             * ************************************************************************** */
            modelBuilder.Entity<Task>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict); // FK owner

            modelBuilder.Entity<Task>()
                .HasOne(t => t.TaskGroup)
                .WithMany()
                .HasForeignKey(t => t.GroupId)
                .OnDelete(DeleteBehavior.Restrict); // FK group
            
            modelBuilder.Entity<Task>()
                .HasOne(t => t.TaskPriority)
                .WithMany()
                .HasForeignKey(t => t.PriorityId)
                .OnDelete(DeleteBehavior.Restrict); // FK priority

            modelBuilder.Entity<Task>()
                .HasOne(t => t.TaskType)
                .WithMany()
                .HasForeignKey(t => t.TypeId)
                .OnDelete(DeleteBehavior.Restrict); // FK type

            modelBuilder.Entity<Task>()
                .HasOne(t => t.DependentTask)
                .WithMany()
                .HasForeignKey(t => t.DependentOn)
                .OnDelete(DeleteBehavior.Restrict); // FK parent task

            /* **************************************************************************
             * Strani kljucevi u tabeli >> ProjectDocumentation <<
             * ************************************************************************** */
            modelBuilder.Entity<ProjectDocumentation>()
                .HasOne(t => t.Project)
                .WithMany()
                .HasForeignKey(t => t.ProjectId)
                .OnDelete(DeleteBehavior.Restrict); // nece se brisati projekti

            /* **************************************************************************
             * Strani kljucevi u tabeli >> AppRole <<
             * ************************************************************************** */
            modelBuilder.Entity<AppRole>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(u => u.Role)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();

            /* **************************************************************************
             * Strani kljucevi u tabeli >> TaskGroup <<
             * ************************************************************************** */
            modelBuilder.Entity<TaskGroup>()
                .HasOne(t => t.Project)
                .WithMany()
                .HasForeignKey(t => t.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);  // pri brisanju grupe brisu se svi taskovi koji pripadaju toj grupi

            /* **************************************************************************
             * Strani kljucevi u tabeli >> GroupsOnProject <<
             * ************************************************************************** */
            modelBuilder.Entity<GroupsOnProject>()
                .HasOne(t => t.TaskGroup)
                .WithMany()
                .HasForeignKey(t => t.GroupId)
                .OnDelete(DeleteBehavior.Cascade);  // pri brisanju grupe brisu se sve veze koje se nalaze ovde

            modelBuilder.Entity<GroupsOnProject>()
                .HasOne(t => t.Project)
                .WithMany()
                .HasForeignKey(t => t.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);  // pri brisanju projekta (koje se nece desiti) brisu se grupe

            /* **************************************************************************
             * Strani kljucevi u tabeli >> TaskComment <<
             * ************************************************************************** */
            modelBuilder.Entity<TaskComment>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade); // pri brisanju korisnika (koje se nece desiti) brisu se komentari

            modelBuilder.Entity<TaskComment>()
                .HasOne(t => t.Task)
                .WithMany()
                .HasForeignKey(t => t.TaskId)
                .OnDelete(DeleteBehavior.Cascade);  // pri brisanju komentara brisu se komentari za taj task

            /* **************************************************************************
             * Strani kljucevi u tabeli >> WorkingHours <<
             * ************************************************************************** */
            modelBuilder.Entity<WorkingHours>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Restrict);  // nece se brisati korisnici

            /* **************************************************************************
             * Strani kljucevi u tabeli >> Notifications <<
             * ************************************************************************** */
            modelBuilder.Entity<Notification>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Restrict);  // nece se brisati korisnici

            /* **************************************************************************
             * Strani kljucevi u tabeli >> UsersOnProject <<
             * ************************************************************************** */
            modelBuilder.Entity<UsersOnProject>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UsersOnProject>()
                .HasOne(t => t.Project)
                .WithMany()
                .HasForeignKey(t => t.ProjectId)
                .OnDelete(DeleteBehavior.Restrict);

            /* **************************************************************************
             * Strani kljucevi u tabeli >> UsersOnTasks <<
             * ************************************************************************** */
            modelBuilder.Entity<UsersOnTasks>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UsersOnTasks>()
                .HasOne(t => t.Task)
                .WithMany()
                .HasForeignKey(t => t.TaskId)
                .OnDelete(DeleteBehavior.Restrict);

            /* *******************************************************************************************************************
             * *******************************************************************************************************************
             * *******************************************************************************************************************
             * UNIQUE OGRANICENJA
             * *******************************************************************************************************************
             * *******************************************************************************************************************
             * ******************************************************************************************************************* */

            // UNIQUE - CompanyRole - Name
            modelBuilder.Entity<CompanyRole>()
                .HasIndex(c => c.Name)
                .IsUnique(true);

            // UNIQUE - TaskType - Name
            modelBuilder.Entity<TaskType>()
                .HasIndex(t => t.Name)
                .IsUnique(true);

            // UNIQUE - TaskPriority - Name
            modelBuilder.Entity<TaskPriority>()
                .HasIndex(t => t.Name)
                .IsUnique(true);

            // UNIQUE - Project - Name
            modelBuilder.Entity<Project>()
                .HasIndex(t => t.Name)
                .IsUnique(true);

            // UNIQUE - Project - Key
            modelBuilder.Entity<Project>()
                .HasIndex(t => t.Key)
                .IsUnique(true);

            // UNIQUE project roles name                    [DEPRECATED?]
            modelBuilder.Entity<ProjectRoles>()
                .HasIndex(r => r.Name)
                .IsUnique(true);

            // UNIQUE - ProjectType - Name
            modelBuilder.Entity<ProjectType>()
                .HasIndex(t => t.Name)
                .IsUnique(true);

            // UNIQUE - ProjectVisibility - Name
            modelBuilder.Entity<ProjectVisibility>()
                .HasIndex(t => t.Name)
                .IsUnique(true);


        }

        /* *******************************************************************************************************************
        * *******************************************************************************************************************
        * *******************************************************************************************************************
        * KOLEKCIJE
        * *******************************************************************************************************************
        * *******************************************************************************************************************
        * ******************************************************************************************************************* */

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
        public DbSet<TaskGroup> TaskGroups { get; set; }
        public DbSet<GroupsOnProject> GroupsOnProjects { get; set; }
    }
}
