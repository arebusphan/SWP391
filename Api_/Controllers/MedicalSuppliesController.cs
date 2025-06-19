using BLL.MedicalSuppliesService;
using DAL.Models;
using Microsoft.AspNetCore.Mvc;

namespace API_.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicalSuppliesController : ControllerBase
    {
        private readonly IMedicalSuppliesService _service;

        public MedicalSuppliesController(IMedicalSuppliesService service ) {
        _service = service;
        }
        [HttpPost("post")]
        public async Task<IActionResult> Add([FromBody] MedicalSuppliesDTO supplies)
        {
            try
            {
                var result = await _service.AddAsync(supplies);
                return Ok(result);
            }
            catch (Exception ex)
            {
              
                Console.WriteLine("Lỗi BE: " + ex.Message);
                return StatusCode(500, new { message = ex.Message, stack = ex.StackTrace });
            }
        }

        [HttpGet("get")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }
        [HttpPut("post/used")]
        public async Task<IActionResult> UpdateAsync(UpdateSuppliesDTO supplies )
        {
            var result = await _service.UpdateAsync(supplies);
            return Ok(result);
        }
    }
}
