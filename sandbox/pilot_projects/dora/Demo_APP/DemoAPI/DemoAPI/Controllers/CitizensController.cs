using DemoAPI.Data;
using DemoAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DemoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CitizensController : Controller
    {
        private readonly DemoDbContext _demoDbContext;

        public CitizensController(DemoDbContext demoDbContext)
        {
            _demoDbContext = demoDbContext;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllCitizens()
        {
            var citizens = await _demoDbContext.Citizens.ToListAsync();

            return Ok(citizens);
        }

        [HttpPost]
        public async Task<IActionResult> AddCitizen([FromBody] Citizen citizenRequest)
        {
            citizenRequest.Umcn = Guid.NewGuid();

            await _demoDbContext.Citizens.AddAsync(citizenRequest);
            await _demoDbContext.SaveChangesAsync();

            return Ok(citizenRequest);
        }

        [HttpGet]
        [Route("{umcn:Guid}")]
        public async Task<IActionResult> GetCitizen([FromRoute]Guid umcn)
        {
            var citizen = await _demoDbContext.Citizens.FirstOrDefaultAsync(x => x.Umcn == umcn);
            if(citizen == null)
            {
                return NotFound();
            }
            return Ok(citizen);
        }

        [HttpPut]
        [Route("{umcn:Guid}")]
        public async Task<IActionResult> UpdateCitizen([FromRoute] Guid umcn, Citizen updateCitizenRequest)
        {
            var citizen = await _demoDbContext.Citizens.FindAsync(umcn);

            if(citizen == null)
            {
                return NotFound();
            }
           
            citizen.Name = updateCitizenRequest.Name;
            citizen.Email = updateCitizenRequest.Email;
            citizen.Phone = updateCitizenRequest.Phone;
            citizen.Address = updateCitizenRequest.Address;

            await _demoDbContext.SaveChangesAsync();
            return Ok(citizen);
        }

        [HttpDelete]
        [Route("{umcn:Guid}")]
        public async Task<IActionResult> DeleteCitizen([FromRoute] Guid umcn)
        {
            var citizen = await _demoDbContext.Citizens.FindAsync(umcn);
            if(citizen == null)
            {
                return NotFound();
            }
            _demoDbContext.Citizens.Remove(citizen);
            await _demoDbContext.SaveChangesAsync();
            return Ok(citizen);
        }
    }
}
