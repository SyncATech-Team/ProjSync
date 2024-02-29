using DemoAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace DemoAPI.Data
{
    public class DemoDbContext : DbContext
    {
        public DemoDbContext(DbContextOptions<DemoDbContext> options) : base(options)
        {
        }

        public DbSet<Citizen> Citizens { get; set; }

    }
}


