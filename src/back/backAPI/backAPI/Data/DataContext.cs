using backAPI.Entities.Domain;
using backAPI.Other.Logger;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

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
             * Strani kljucevi u tabeli >> Issue <<
             * ************************************************************************** */
            modelBuilder.Entity<Issue>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.OwnerId)
                .OnDelete(DeleteBehavior.Restrict); // FK owner

            modelBuilder.Entity<Issue>()
                .HasOne(t => t.IssueGroup)
                .WithMany()
                .HasForeignKey(t => t.GroupId)
                .OnDelete(DeleteBehavior.Cascade); // FK group -> ukoliko brisemo grupu brisemo i sve issue-ove iz te grupe
            
            modelBuilder.Entity<Issue>()
                .HasOne(t => t.IssuePriority)
                .WithMany()
                .HasForeignKey(t => t.PriorityId)
                .OnDelete(DeleteBehavior.Restrict); // FK priority

            modelBuilder.Entity<Issue>()
                .HasOne(t => t.IssueType)
                .WithMany()
                .HasForeignKey(t => t.TypeId)
                .OnDelete(DeleteBehavior.Restrict); // FK type

            modelBuilder.Entity<Issue>()
                .HasOne(t => t.IssueStatus)
                .WithMany()
                .HasForeignKey(t => t.StatusId)
                .OnDelete(DeleteBehavior.Restrict); // FK status

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
             * Strani kljucevi u tabeli >> IssueGroup <<
             * ************************************************************************** */
            modelBuilder.Entity<IssueGroup>()
                .HasOne(t => t.Project)
                .WithMany()
                .HasForeignKey(t => t.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);  // pri brisanju grupe brisu se svi taskovi koji pripadaju toj grupi

            /* **************************************************************************
             * Strani kljucevi u tabeli >> IssueComment <<
             * ************************************************************************** */
            modelBuilder.Entity<IssueComment>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade); // pri brisanju korisnika (koje se nece desiti) brisu se komentari

            modelBuilder.Entity<IssueComment>()
                .HasOne(t => t.Issue)
                .WithMany()
                .HasForeignKey(t => t.IssueId)
                .OnDelete(DeleteBehavior.Cascade);  // pri brisanju komentara brisu se komentari za taj issue

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
             * Strani kljucevi u tabeli >> UsersOnIssues <<
             * ************************************************************************** */
            modelBuilder.Entity<UsersOnIssue>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UsersOnIssue>()
                .HasOne(t => t.Issue)
                .WithMany()
                .HasForeignKey(t => t.IssueId)
                .OnDelete(DeleteBehavior.Restrict);

            /* **************************************************************************
             * Strani kljucevi u tabeli >> IssueDependencies <<
             * ************************************************************************** */
            modelBuilder.Entity<IssueDependencies>()
                .HasOne(i => i.Origin)
                .WithMany()
                .HasForeignKey(t => t.OriginId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<IssueDependencies>()
                .HasOne(i => i.Target)
                .WithMany()
                .HasForeignKey(t => t.TargetId)
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

            // UNIQUE - IssueType - Name
            modelBuilder.Entity<IssueType>()
                .HasIndex(t => t.Name)
                .IsUnique(true);

            // UNIQUE - IssuePriority - Name
            modelBuilder.Entity<IssuePriority>()
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
        public DbSet<UsersOnIssue> UsersOnIssues { get; set; }
        public DbSet<UsersOnProject> UsersOnProjects { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        

        // PROJECT
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectVisibility> ProjectVisibilities { get; set; }
        public DbSet<ProjectType> ProjectTypes { get; set; }
        public DbSet<ProjectDocumentation> ProjectDocumentation { get; set; }


        // ISSUE
        public DbSet<Issue> Issues { get; set; }
        public DbSet<IssueType> IssueTypes { get; set; }
        public DbSet<IssuePriority> IssuePriority { get; set; }
        public DbSet<IssueGroup> IssueGroups { get; set; }
        public DbSet<IssueStatus> IssueStatuses { get; set; }
        public DbSet<IssueComment> IssueComments { get; set; }
        public DbSet<IssueDependencies> IssueDependencies { get; set; }
        public DbSet<IssueDocumentation> IssueDocumentation { get; set; }
    }
}
