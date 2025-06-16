using BLL.Interfaces;
using DAL.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassesController : ControllerBase
    {
        private readonly IClassesService _service;

        public ClassesController(IClassesService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<Classes>>> Get()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }
    }
}
