using CityInfo.API.Entities;

namespace CityInfo.API.Services
{
    public interface ICityInfoRepository
    {
        Task<IEnumerable<PointOfInterest>> GetPointsOfInterestAsync();
        Task<PointOfInterest?> GetPointOfInterestAsync(int pointOfInterestId);
        void AddPointOfInterest(PointOfInterest pointOfInterest);
        Task SaveChangesAsync();
        void DeletePointOfInterest(PointOfInterest pointOfInterest);
    }
}
