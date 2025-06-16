using Microsoft.AspNetCore.Mvc;

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
            CreatedAt = DateTime.Now
        };

        await _service.SaveResultAsync(result);
        return Ok(new { message = "Vaccination result saved." });
    }
}
