using DTOs;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class VaccinationController : ControllerBase
{
    private readonly IVaccinationRecordService _service;

    public VaccinationController(IVaccinationRecordService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] VaccinationRecordDto dto)
    {
        await _service.AddVaccinationAsync(dto);
        return Ok(new { message = "Vaccination record added." });
    }

    [HttpGet("student/{studentId}")]
    public async Task<IActionResult> GetByStudent(int studentId)
    {
        var records = await _service.GetVaccinationsAsync(studentId);
        return Ok(records);
    }
}
