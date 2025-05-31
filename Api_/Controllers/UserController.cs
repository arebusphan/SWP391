using BLL.UserService;
using Microsoft.AspNetCore.Mvc;
using static DAL.Models.UserDTO;

namespace API_.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _service;

        public UserController(IUserService service)
        {
            _service = service;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddUser([FromBody] UserCreateDTO dto)
        {
            await _service.CreateUserAsync(dto);
            return Ok(new { message = "User added successfully." });
        }
    }
}
