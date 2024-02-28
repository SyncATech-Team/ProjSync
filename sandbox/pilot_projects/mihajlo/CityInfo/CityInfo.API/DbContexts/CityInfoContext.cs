using CityInfo.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace CityInfo.API.DbContexts
{
    public class CityInfoContext : DbContext
    {
        public DbSet<PointOfInterest> PointsOfInterest { get; set; } = null!;

        public CityInfoContext(DbContextOptions<CityInfoContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<PointOfInterest>()
             .HasData(
               new PointOfInterest("Ajfelov toranj", "Pariz", "Francuska")
               {
                   Id = 1,
                   Description = "Veliki toranj."
               },
               new PointOfInterest("Forum", "Rim", "Italija")
               {
                   Id = 2,
                   Description = "Trg iz doba antickog Rima."
               },
               new PointOfInterest("Kalemegdan", "Beograd", "Srbija")
               {
                   Id = 3,
                   Description = "Srednjevekovna tvrdjava."
               },
               new PointOfInterest("Muzej 21. Oktobar", "Kragujevac", "Srbija")
               {
                   Id = 4,
                   Description = "Muzej posvecen zrtvama drugog svetskog rata."
               },
               new PointOfInterest("Katedrala Duomo", "Milano", "Italija")
               {
                   Id = 5,
                   Description = "Jedna od najvecih katedrala evrope."
               }
               );
            base.OnModelCreating(modelBuilder);
        }
    }
}
