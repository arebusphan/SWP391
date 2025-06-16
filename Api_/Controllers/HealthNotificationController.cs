using Microsoft.AspNetCore.Mvc;

[Route("api/notifications")]
[ApiController]
public class HealthNotificationController : ControllerBase
{
    private readonly IHealthNotificationService _service;

    public HealthNotificationController(IHealthNotificationService service)
    {
        _service = service;
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateNotificationDTO dto)
    {
        var model = new HealthNotification
        {
            EventName = dto.EventName,
            EventType = dto.EventType,
            EventImage = dto.EventImage,
            EventDate = dto.EventDate,
            CreatedBy = dto.CreatedBy,
            CreatedAt = DateTime.Now
        };

        var id = await _service.CreateNotificationAsync(model, dto.ClassIds);
        return Ok(new { NotificationId = id });
    }
}
