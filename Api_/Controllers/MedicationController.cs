using BLL.MedicationIntakeLogsService;
using BLL.MedicationService;
using DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/medication-requests")]
    [ApiController]
    [Authorize]
    public class MedicationController : ControllerBase
    {
        private readonly IMedicationService _medicationService;
        private readonly IMedicationIntakeLogService _logService;

        public MedicationController(IMedicationService medicationService,IMedicationIntakeLogService logService)
        {
            _medicationService = medicationService;
            _logService = logService;
        }

        [HttpPost("parent-request")]
        public IActionResult SubmitMedicationRequest([FromBody] MedicationRequestDTO dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            int parentId = int.Parse(userIdClaim.Value);

            try
            {
                _medicationService.CreateRequest(dto, parentId);
                return Ok(new { message = "Medication request submitted successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("request-history")]
        public IActionResult GetMyMedicationRequests([FromQuery] string? status)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            int parentId = int.Parse(userIdClaim.Value);

            // ✅ Gọi service kèm theo filter status
            var list = _medicationService.GetRequestsByParent(parentId, status);

            return Ok(list);
        }


        [HttpGet("nurseGetRequest")]
        public IActionResult GetPendingRequests()
        {
            var result = _medicationService.GetPendingRequests();
            return Ok(result);
        }

        public class UpdateStatusDTO
        {
            public string Status { get; set; }
            public int ReviewedBy { get; set; }
        }

        [HttpPut("{id}/updateStatus")]
        public IActionResult UpdateRequestStatus(int id, [FromBody] UpdateStatusDTO dto)
        {
            var success = _medicationService.UpdateRequestStatus(id, dto.Status, dto.ReviewedBy);
            if (!success) return BadRequest("Update failed.");

            return Ok(new { message = "Status updated successfully" });
        }
        [HttpPost("logs")]
        public async Task<IActionResult> CreateIntakeLog([FromBody] MedicationIntakeLogCreateDto dto)
        {
            try
            {
                var created = await _logService.CreateLogAsync(dto);
                return Ok(created);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("logs/{studentId}")]
        public async Task<IActionResult> GetIntakeLogsByStudent(int studentId)
        {
            var logs = await _logService.GetLogsByStudentIdAsync(studentId);
            return Ok(logs);
        }
    }
}
