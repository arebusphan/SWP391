using BLL.AuthService;
using DAL;
using DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace WebApplication6.controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly IAuthService _authService;

        public AuthController(
            IAuthService authService,
            IConfiguration configuration

            )
        {

            _authService = authService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            var (success, message, user) = await _authService.LoginUserAsync(loginDTO);
            if (success)
            {
                string token = _authService.CreateToken(user);
                return Ok(new { message, token });
            }
            else
            {
                return BadRequest(new { message });
            }
        }

    }
}