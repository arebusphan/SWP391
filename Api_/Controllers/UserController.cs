﻿using BLL.UserService;
using DAL.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        public async Task<IActionResult> AddUser([FromBody] ParentWithStudentDTO dto)
        {
            try
            {
                await _service.CreateUserAsync(dto);
                return Ok(new { message = "User added successfully." });
            }
            catch (Exception ex)
            {

                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpGet("get")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _service.GetAllAsync();
            return Ok(users);
        }
        [HttpPut("update")]
        public async Task<IActionResult> UpdateUser([FromBody] UserUpdateDTO user)
        {
            var result = await _service.UpdateAsync(user);
            if (!result) return BadRequest(new { message = "update fail" });
            return Ok(new { message = "update successful" });
        }
        [HttpPut("Delete")]
        public async Task<IActionResult> DeleteUser([FromBody] UserDeleteDTO dto)
        {
            var result = await _service.DeleteAsync(dto);
            if (!result) return BadRequest(new { message = "delete fail" });
            return Ok(new { message = "delete successful" });
        }
    }
}
