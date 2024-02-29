using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using ToDo.Model;

namespace ToDo

{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<TodoItem> TodoItems { get; set; }
    }
}