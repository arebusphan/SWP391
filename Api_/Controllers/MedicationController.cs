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

        public MedicationController(IMedicationService medicationService)
        {
            _medicationService = medicationService;
        }

        [HttpPost]
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
        public IActionResult GetMyMedicationRequests()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            int parentId = int.Parse(userIdClaim.Value);

            var list = _medicationService.GetRequestsByParent(parentId);
            return Ok(list);
        }

    }
}
