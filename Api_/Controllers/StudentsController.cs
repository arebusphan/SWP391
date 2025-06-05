using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BLL.StudentService;
using BLL.HealthCheckService;
using System.Security.Claims;
using DAL.Models;

namespace API.Controllers
{
    [Route("api/students")]
    [ApiController]
    [Authorize]
    public class StudentsController : ControllerBase
    {
        private readonly IStudentService _studentService;
        private readonly IHealthCheckService _healthCheckService;
        private readonly IStudentStatusService _studentStatusService;

        public StudentsController(
            IStudentService studentService,
            IHealthCheckService healthCheckService,
            IStudentStatusService studentStatusService)
        {
            _studentService = studentService;
            _healthCheckService = healthCheckService;
            _studentStatusService = studentStatusService;
        }

        [HttpGet("get-StuByGuardian")]
        public IActionResult GetMyStudents()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            int guardianId = int.Parse(userIdClaim.Value);
            var students = _studentService.GetStudentsByGuardian(guardianId);

            return Ok(students);
        }

        [HttpPost("{id}/submit-health")]
        public IActionResult SubmitHealthProfile(int id, [FromBody] HealthProfileDTO dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);

            try
            {
                _healthCheckService.SubmitHealthProfile(id, dto, userId);
                return Ok(new { message = "Health profile submitted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("stu-status")]
        [Authorize(Roles = "Parent")]
        public IActionResult GetMyChildrenStatus()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            int guardianId = int.Parse(userIdClaim.Value);
            var result = _studentStatusService.GetStatusForGuardian(guardianId);

            return Ok(result);
        }
    }
}
