using Microsoft.AspNetCore.Mvc;

[Route("api/notifications/students")]
[ApiController]
public class NotificationStudentController : ControllerBase
{
    private readonly INotificationStudentService _service;
    public NotificationStudentController(INotificationStudentService service) => _service = service;

    [HttpGet("confirmation")]
    public async Task<IActionResult> GetConfirmation([FromQuery] int notificationId, [FromQuery] int classId)
    {
        var result = await _service.GetConfirmationByClassAsync(notificationId, classId);
        return Ok(result);
    }
}
