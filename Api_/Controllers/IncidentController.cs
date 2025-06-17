using BLL.IncidentService;
using DAL.Models;
using Microsoft.AspNetCore.Mvc;

namespace API_.Controllers
{

    [ApiController]
    [Route("/api[controller]")]

    public class IncidentController : ControllerBase
    {
        private readonly IIncidentService _service;

        public IncidentController(IIncidentService service) {
        _service = service;
        }
        [HttpPost("post")]
        public async Task<MedicalIncidents> AddAsync(IncidentDTO incident)
        {
            return await _service.AddAsync(incident);
        }

    }
}
