using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BLL.StudentService;
using BLL.HealthCheckService;
using DTOs;
using System.Security.Claims;

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
        [Authorize(Roles = "Parent")]
        public IActionResult GetMyStudents()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            int guardianId = int.Parse(userIdClaim.Value);
            var students = _studentService.GetStudentsByGuardian(guardianId);

            return Ok(students);
        }

        [HttpGet("get-all-basic")]
        [Authorize(Roles = "MedicalStaff")]
        public IActionResult GetAllStudentsBasic()
        {
            var students = _studentService.GetAllBasicProfiles();
            return Ok(students);
        }

        // ✅ Sửa phần này
        [HttpPost("{id}/healthCheck")]
        [Authorize(Roles = "MedicalStaff")]
        public IActionResult SubmitHealthCheck(int id, [FromBody] HealthCheckDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            dto.StudentId = id;
            dto.RecordedBy = int.Parse(userIdClaim.Value);
            dto.CheckDate = DateTime.Now;

            try
            {
                _healthCheckService.SubmitHealthCheck(dto);
                return Ok(new { message = "Health check submitted successfully" });
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

        [HttpGet("all-health-status")]
        [Authorize(Roles = "MedicalStaff")]
        public IActionResult GetAllStudentHealthStatus()
        {
            var result = _studentStatusService.GetAllStatusForMedicalStaff();
            return Ok(result);
        }
        [HttpGet("my-health-checks")]
        [Authorize(Roles = "Parent")]
        public IActionResult GetMyChildrenHealthChecks()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            int guardianId = int.Parse(userIdClaim.Value);

            try
            {
                var healthChecks = _healthCheckService.GetHealthChecksByGuardian(guardianId);
                return Ok(healthChecks);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

    }
}
