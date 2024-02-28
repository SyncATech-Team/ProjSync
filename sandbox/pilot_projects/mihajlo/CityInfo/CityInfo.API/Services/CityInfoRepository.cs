using CityInfo.API.DbContexts;
using CityInfo.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace CityInfo.API.Services
{
    public class CityInfoRepository : ICityInfoRepository
    {
        private readonly CityInfoContext _context;

        public CityInfoRepository(CityInfoContext context)
        {
            _context = context;
        }

        public async Task<PointOfInterest?> GetPointOfInterestAsync(int pointOfInterestId)
        {
            return await _context.PointsOfInterest.FirstOrDefaultAsync(p => p.Id == pointOfInterestId);
        }

        public async Task<IEnumerable<PointOfInterest>> GetPointsOfInterestAsync()
        {
            return await _context.PointsOfInterest.ToListAsync();
        }

        public void AddPointOfInterest(PointOfInterest pointOfInterest)
        {
            _context.PointsOfInterest.Add(pointOfInterest);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public void DeletePointOfInterest(PointOfInterest pointOfInterest)
        {
            _context.PointsOfInterest.Remove(pointOfInterest);
        }

    }
}
