using BLL.HealthProfile;
using DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API_.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthProfileController : ControllerBase
    {
        private readonly IHealthProfileService _service;

        public HealthProfileController(IHealthProfileService service)
        {
            _service = service;
        }

        [HttpPost]
        [Authorize(Roles = "Parent")]
        public async Task<IActionResult> SubmitProfile([FromBody] HealthProfileDTO dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            try
            {
                await _service.SubmitAsync(dto, userId);
                return Ok(new { message = "Submitted" });
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ EX: " + ex.Message);
                Console.WriteLine("❌ Inner EX: " + ex.InnerException?.Message);
                return BadRequest(new { error = ex.InnerException?.Message ?? ex.Message });
            }
        }



        [HttpGet("pending")]
        [Authorize(Roles = "MedicalStaff")]
        public async Task<IActionResult> GetPending()
        {
            var list = await _service.GetPendingProfilesAsync();
            return Ok(list);
        }

        [HttpGet("student/{studentId}")]
        [Authorize(Roles = "Parent,MedicalStaff")]
        public async Task<IActionResult> GetByStudentId(int studentId)
        {
            var profile = await _service.GetByStudentIdAsync(studentId);
            if (profile == null) return NotFound("No profile found.");
            return Ok(profile);
        }
        [HttpGet("mine")]
        [Authorize(Roles = "Parent")]
        public async Task<IActionResult> GetMine()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var result = await _service.GetProfilesByUserAsync(userId);
            return Ok(result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Parent")]
        public async Task<IActionResult> Update(int id, [FromBody] HealthProfileDTO dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            await _service.UpdateAsync(id, dto, userId);
            return Ok(new { message = "Updated" });
        }

        [HttpPost("send-reminder")]
        [Authorize(Roles = "MedicalStaff")]
        public async Task<IActionResult> SendHealthProfileReminder([FromBody] SendReminderRequest request)
        {
            try
            {
                await _service.SendHealthProfileReminderAsync(request.StudentIds);
                return Ok(new { message = "Reminders sent successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

    public class SendReminderRequest
    {
        public List<int> StudentIds { get; set; } = new();
    }
}
