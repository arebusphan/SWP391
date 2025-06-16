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

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromForm] HealthNotificationDTO dto, IFormFile? image)
    {
        string? savedFileName = null;

        if (image != null)
        {
            var uploadsFolder = Path.Combine("Uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            savedFileName = fileName;
        }

        var model = new HealthNotification
        {
            EventName = dto.EventName,
            EventType = dto.EventType,
            EventImage = savedFileName,
            EventDate = dto.EventDate,
            CreatedBy = dto.CreatedBy,
            CreatedAt = DateTime.Now
        };

        var id = await _service.CreateNotificationAsync(model, dto.ClassIds);
        return Ok(new { NotificationId = id });
    }
}
