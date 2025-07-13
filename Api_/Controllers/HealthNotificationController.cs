using Microsoft.AspNetCore.Mvc;
using DAL.Models;

[Route("api/[controller]")]
[ApiController]
public class HealthNotificationController : ControllerBase
{
    private readonly IHealthNotificationService _service;

    public HealthNotificationController(IHealthNotificationService service)
    {
        _service = service;
    }
    [HttpPost("post")]
    public async Task<IActionResult> Create([FromBody] HealthNotificationDTO dto)
    {
        try
        {
            var model = new HealthNotification
            {
                EventName = dto.EventName,
                EventType = dto.EventType,
                EventImage = dto.EventImage,
                EventDate = DateTime.SpecifyKind(dto.EventDate, DateTimeKind.Utc),
                CreatedBy = dto.CreatedBy,
                CreatedAt = DateTime.UtcNow
            };

            var id = await _service.CreateNotificationAsync(model, dto.ClassIds);
            return Ok(new { id });
        }
        catch (Exception ex)
        {
            var inner = ex;
            while (inner.InnerException != null)
                inner = inner.InnerException;

            return StatusCode(500, new { error = inner.Message });
        }
    }

    [HttpGet("get")]
    public async Task<IActionResult> GetHistory()
    {
        var histories = await _service.GetNotificationHistoriesAsync();
        return Ok(histories);
    }
    [HttpGet("list-basic")]
    public async Task<IActionResult> GetBasicList()
    {
        var result = await _service.GetAllBasicNotificationsAsync();
        return Ok(result);
    }

}