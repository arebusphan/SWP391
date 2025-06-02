using BLL.UserService;
using DAL.Models;
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
        public async Task<IActionResult> AddUser([FromBody] UserDTO dto)
        {
            await _service.CreateUserAsync(dto);
            return Ok(new { message = "User added successfully." });
        }
        [HttpGet("get")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _service.GetAllAsync();
            return Ok(users);
        }
    }
}
