using BLL.HealthNotificationService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [ApiController]
    [Route("api/health-notifications")]
    [Authorize]
    public class HealthNotificationController : ControllerBase
    {
        private readonly IHealthNotificationService _service;

        public HealthNotificationController(IHealthNotificationService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            int parentId = int.Parse(userIdClaim.Value);
            var list = _service.GetNotificationsForParent(parentId);

            return Ok(list);
        }
    }
}
