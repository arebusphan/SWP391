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

    [HttpGet("all")]
    public async Task<IActionResult> GetAllEvents()
    {
        var events = await _service.GetAllEventsAsync();
        return Ok(events);
    }

    [HttpGet("student/{studentId}")]
    public async Task<IActionResult> GetEvents(int studentId)
    {
        var events = await _service.GetStudentEventsAsync(studentId);
        return Ok(events);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] HealthEventDto dto)
    {
        await _service.RecordHealthEventAsync(dto);
        return Ok(new { message = "Health event added." });
    }

    [HttpPut("{eventId}")]
    public async Task<IActionResult> Update(int eventId, [FromBody] HealthEventDto dto)
    {
        dto.EventId = eventId;
        await _service.UpdateHealthEventAsync(dto);
        return Ok(new { message = "Health event updated." });
    }

    [HttpDelete("{eventId}")]
    public async Task<IActionResult> Delete(int eventId)
    {
        await _service.DeleteHealthEventAsync(eventId);
        return Ok(new { message = "Deleted successfully." });
    }
}