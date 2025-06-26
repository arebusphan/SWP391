using BLL.IncidentService;
using DAL.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace API_.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IncidentController : ControllerBase
    {
        private readonly IIncidentService _service;

        public IncidentController(IIncidentService service)
        {
            _service = service;
        }

      
        [HttpPost("post")]
        public async Task<ActionResult<IncidentDTO>> AddAsync(IncidentDTO incident)
        {
            try
            {
             
                var newIncident = await _service.AddAsync(incident);

               
                return CreatedAtAction(nameof(GetById), new { id = newIncident.IncidentName }, newIncident);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Lỗi khi thêm sự cố: {ex.Message}" });
            }
        }

       
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null)
                return NotFound(new { message = "Không tìm thấy sự cố." });

            return Ok(result);
        }

       
        [HttpGet("incident-supplies-history")]
        public async Task<IActionResult> GetIncidentSuppliesHistory()
        {
            try
            {
                var result = await _service.GetAllIncidentSuppliesHistoryAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Lỗi khi lấy lịch sử vật tư: {ex.Message}" });
            }
        }
        [HttpGet("guardian/{guardianId}/incidents")]
        public async Task<IActionResult> GetIncidentsByGuardian(int guardianId)
        {
            var result = await _service.GetIncidentsByGuardianIdAsync(guardianId);
            return Ok(result);
        }
    }
}
