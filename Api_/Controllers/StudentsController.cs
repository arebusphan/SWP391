using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using BLL.StudentService;
using BLL.HealthCheckService;
using BLL.StudentDetailService;
using DTOs;
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
        private readonly IStudentDetailService _studentDetailService;

        public StudentsController(
            IStudentService studentService,
            IHealthCheckService healthCheckService,
            IStudentStatusService studentStatusService,
            IStudentDetailService studentDetailService)
        {
            _studentService = studentService;
            _healthCheckService = healthCheckService;
            _studentStatusService = studentStatusService;
            _studentDetailService = studentDetailService;
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

        [HttpPost("{id}/healthCheck")]
        [Authorize(Roles = "MedicalStaff")]
        public async Task<IActionResult> SubmitHealthCheck(int id, [FromBody] HealthCheckDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            dto.StudentId = id;
            dto.RecordedBy = int.Parse(userIdClaim.Value);
            dto.CheckDate = DateTime.UtcNow;

            try
            {
                await _healthCheckService.SubmitHealthCheckAsync(dto);
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
        public ActionResult<List<HealthCheckDto>> GetMyChildrenHealthChecks()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            int guardianId = int.Parse(userIdClaim.Value);

            var result = _healthCheckService.GetHealthChecksByGuardian(guardianId);

            if (result == null || result.Count == 0)
            {
                return NotFound("No health checks found.");
            }

            return Ok(result);
        }


        [HttpGet("get-detail/{studentId}")]
        [Authorize(Roles = "MedicalStaff,Parent")]
        public IActionResult GetStudentDetail(int studentId)
        {
            var detail = _studentDetailService.GetStudentDetail(studentId);
            if (detail == null)
                return NotFound("Student not found.");

            return Ok(detail);
        }
        [HttpGet("by-class/{classId}")]

        public async Task<ActionResult<List<StudentDTO>>> GetStudentsByClassId(int classId)
        {
            var students = await _studentService.GetStudentsByClassAsync(classId);
            return Ok(students);
        }
        [HttpGet("get-All-Student")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllStudent()
        {
            var students = await _studentService.GetAllStudentDtosAsync();
            return Ok(students);
        }
        [HttpPost("addstudent")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddStudents([FromBody] AddStudentRequest request)
        {
            await _studentService.AddStudentsAsync(request.Students, request.GuardianId);
            return Ok();
        }
        [HttpPut("update/{studentId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStudent(int studentId, [FromBody] UpdateStudent dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                await _studentService.UpdateStudentAsync(studentId, dto);
                return Ok(new { message = "Student updated successfully." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the student.", detail = ex.Message });
            }
        }


    }
}
