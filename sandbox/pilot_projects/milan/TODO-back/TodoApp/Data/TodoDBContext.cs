using Microsoft.EntityFrameworkCore;
using TodoApp.Models;

namespace TodoApp.Data
{
    public class TodoDBContext : DbContext
    {

        public TodoDBContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<TodoTask> Tasks { get; set; }
    }
}
