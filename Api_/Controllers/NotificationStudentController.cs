using DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


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
    [HttpPost("confirm")]
    public IActionResult ConfirmVaccination([FromBody] VaccineConfirmination request)
    {
        if (request.NotificationStudentId <= 0 ||
            string.IsNullOrWhiteSpace(request.ConfirmStatus) ||
            string.IsNullOrWhiteSpace(request.ParentPhone))
        {
            return BadRequest("Invalid request.");
        }

        var result = _service.ConfirmVaccination(request);

        if (!result)
            return NotFound("Record not found.");

        return Ok("Confirmation submitted successfully.");
    }
    [HttpGet("pending")]
    [Authorize(Roles = "Parent")]
    public ActionResult<List<VaccineConfirmInfo>> GetPendingConfirmations()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("User is not authenticated.");
        }

        int guardianId = int.Parse(userIdClaim.Value);

        var result = _service.GetPendingVaccinationsByGuardian(guardianId);

        if (result == null || result.Count == 0)
        {
            return NotFound("No pending confirmations found.");
        }

        return Ok(result);
    }
}
