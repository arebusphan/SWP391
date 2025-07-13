using Microsoft.AspNetCore.Mvc;
using DTOs;
using BLL.Interfaces;
using DAL.Models;

namespace API.Controllers
{
    [ApiController]
    [Route("api/vaccinations")]
    public class VaccinationResultController : ControllerBase
    {
        private readonly IVaccinationResultService _service;
        public VaccinationResultController(IVaccinationResultService service) => _service = service;

        [HttpPost("record")]
        public async Task<IActionResult> Record([FromBody] VaccinationResultDTO dto)
        {
            var result = new VaccinationResults
            {
                StudentId = dto.StudentId,
                NotificationId = dto.NotificationId,
                Vaccinated = dto.Vaccinated,
                VaccinatedDate = dto.VaccinatedDate,
                ObservationStatus = dto.ObservationStatus,
                VaccinatedBy = dto.VaccinatedBy,
                CreatedAt = DateTime.UtcNow
            };

            await _service.SaveResultAsync(result);
            return Ok(new { message = "Vaccination result saved." });
        }

        [HttpGet("by-notification")]
        public async Task<IActionResult> GetByNotification(int notificationId, int classId)
        {
            var results = await _service.GetResultsByNotificationAsync(notificationId, classId);
            return Ok(results);
        }

        [HttpGet("by-guardian")]
        public async Task<IActionResult> GetByGuardian(int guardianId)
        {
            var results = await _service.GetResultsByGuardianAsync(guardianId);
            return Ok(results);
        }
    }
}
