using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class HealthEventController : ControllerBase
{
    private readonly IHealthEventService _service;

    public HealthEventController(IHealthEventService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> RecordEvent([FromBody] HealthEventDto dto)
    {
        if (dto == null)
            return BadRequest(new { message = "Request body is missing or invalid." });

        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // ⚠️ Sau này thay bằng: var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        var userId = 1;

        await _service.RecordHealthEventAsync(dto, userId);
        return Ok(new { message = "Health event recorded successfully." });
    }

    [HttpGet("student/{studentId}")]
    public async Task<IActionResult> GetEvents(int studentId)
    {
        var events = await _service.GetStudentEventsAsync(studentId);
        return Ok(events);
    }
}
