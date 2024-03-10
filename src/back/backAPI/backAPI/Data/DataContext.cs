using backAPI.Entities.Domain;
using backAPI.Other.Logger;
using Microsoft.EntityFrameworkCore;
using Task = backAPI.Entities.Domain.Task;

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

        public DbSet<User> Users { get; set; }
        public DbSet<CompanyRole> Roles { get; set; }
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
    }
}
