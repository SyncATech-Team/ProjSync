using AutoMapper;
using CityInfo.API.Entities;
using CityInfo.API.Models;
using CityInfo.API.Services;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace CityInfo.API.Controllers
{
    [Route("api/pointsofinterest")]
    [ApiController]
    public class PointsOfInterestController : ControllerBase
    {
        private readonly ICityInfoRepository _cityInfoRepository;
        private readonly IMapper _mapper;

        public PointsOfInterestController(ILogger<PointsOfInterestController> logger, 
            ICityInfoRepository cityInfoRepository,
            IMapper mapper)
        {
            _cityInfoRepository = cityInfoRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PointOfInterestDto>>> GetPointsOfInterest()
        {

            var pointsOfInterestForCity = await _cityInfoRepository.GetPointsOfInterestAsync();

            return Ok(_mapper.Map<IEnumerable<PointOfInterestDto>>(pointsOfInterestForCity));

        }

        [HttpGet("{pointOfInterestId}", Name = "GetPointOfInterest")]
        public async Task<ActionResult<PointOfInterestDto>> GetPointOfInterest(int pointOfInterestId)
        {

            var pointOfInterest = await _cityInfoRepository.GetPointOfInterestAsync(pointOfInterestId);

            if (pointOfInterest == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<PointOfInterestDto>(pointOfInterest));
        }
        
        
        [HttpPost]
        public async Task<ActionResult<PointOfInterestDto>> CreatePointOfInterest(int cityId, PointOfInterestCreateDto pointOfInterest)
        {
            var pointOfInterestToAdd = _mapper.Map<PointOfInterest>(pointOfInterest);

            _cityInfoRepository.AddPointOfInterest(pointOfInterestToAdd);

            await _cityInfoRepository.SaveChangesAsync();

            var createdPointOfInterest = _mapper.Map<PointOfInterestDto>(pointOfInterestToAdd);

            return CreatedAtRoute("GetPointOfInterest", new { pointOfInterestId = createdPointOfInterest.Id }, createdPointOfInterest);
        }
        
        [HttpPut("{pointOfInterestId}")]
        public async Task<ActionResult> UpdatePointOfInterest(int pointOfInterestId, PointOfInterestUpdateDto pointOfInterest)
        {

            var pointOfInterestEntity = await _cityInfoRepository.GetPointOfInterestAsync(pointOfInterestId);
            if (pointOfInterestEntity == null)
            {
                return NotFound();
            }

            _mapper.Map(pointOfInterest, pointOfInterestEntity);

            await _cityInfoRepository.SaveChangesAsync();

            return NoContent();
        }
        
        
        [HttpDelete("{pointOfInterestId}")]
        public async Task<ActionResult> DeletePointOfInterest(int pointOfInterestId)
        {
            var pointOfInterest = await _cityInfoRepository.GetPointOfInterestAsync(pointOfInterestId);
            if (pointOfInterest == null)
            {
                return NotFound();
            }

            _cityInfoRepository.DeletePointOfInterest(pointOfInterest);
            await _cityInfoRepository.SaveChangesAsync();

            return NoContent();
        }
        
    }
}
