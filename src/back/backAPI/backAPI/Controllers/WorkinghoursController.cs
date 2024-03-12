﻿using backAPI.DTO;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
    public class WorkinghoursController : BaseApiController {

        private readonly IWorkingHoursRepository workingHoursRepository;

        /* *****************************************************************************
         * Konstruktor
         * ***************************************************************************** */
        public WorkinghoursController(IWorkingHoursRepository workingHoursRepository) {
            this.workingHoursRepository = workingHoursRepository;
        }
        /* *****************************************************************************
         * GET | Get ALL working hours for all users
         * ***************************************************************************** */
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ApiWorkingHours>>> GetAllWorkingHours() {
            var workHours = await workingHoursRepository.GetWorkingHoursAsync();

            List<ApiWorkingHours> result = new List<ApiWorkingHours>();

            foreach(var workHour in workHours) {
                result.Add(new ApiWorkingHours {
                    UserId = workHour.UserId,
                    SpecificDate = workHour.SpecificDate,
                    HoursWorking = workHour.HoursWorking,
                    Weekend = workHour.Weekend,
                    Overtime = workHour.Overtime
                });
            }

            return result;

        }
    }
}
