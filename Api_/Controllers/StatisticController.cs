using BLL.OverviewService;
using Microsoft.AspNetCore.Mvc;

namespace API_.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatisticController : ControllerBase
    {
        private readonly IStatisticService _service;

        public StatisticController(IStatisticService service)
        {
            _service = service;
        }

        [HttpGet("overview")]
        public IActionResult GetOverview()
        {
            var result = _service.GetOverviewStatistics();
            return Ok(result);
        }
    }
}
