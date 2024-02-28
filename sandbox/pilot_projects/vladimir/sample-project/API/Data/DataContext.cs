using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        { }

        // DbSet predstavlja kolekciju svih entiteta
        public DbSet<AppUser> Users { get; set; }
    }
}