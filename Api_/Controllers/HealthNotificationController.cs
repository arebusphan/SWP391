using Microsoft.AspNetCore.Mvc;
using DAL.Models;

[Route("api/notifications")]
[ApiController]
public class HealthNotificationController : ControllerBase
{
    private readonly IHealthNotificationService _service;

    public HealthNotificationController(IHealthNotificationService service)
    {
        _service = service;
    }
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] HealthNotificationDTO dto)
    {
        var model = new HealthNotification
        {
            EventName = dto.EventName,
            EventType = dto.EventType,
            EventImage = dto.EventImage, // chính là link ảnh đã upload lên cloud
            EventDate = dto.EventDate,
            CreatedBy = dto.CreatedBy,
            CreatedAt = DateTime.Now
        };

        var id = await _service.CreateNotificationAsync(model, dto.ClassIds);
        return Ok(new { NotificationId = id });
    }

    [HttpGet]
    public async Task<IActionResult> GetHistory()
    {
        var histories = await _service.GetNotificationHistoriesAsync();
        return Ok(histories);
    }
}