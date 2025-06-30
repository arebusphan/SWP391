using Microsoft.AspNetCore.Mvc;
using BLL.OtpService;
using DAL;
using DAL.Models;
using Microsoft.AspNetCore.Authorization;

namespace YourApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OtpController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly OtpService _otpService;

        public OtpController(AppDbContext context, OtpService otpService)
        {
            _context = context;
            _otpService = otpService;
        }

        // Gửi OTP: truyền phone → tìm email trong DB → gửi OTP qua email
        [HttpPost("send")]
        public IActionResult SendOtp([FromBody] SendOtpRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Phone))
                return BadRequest(new { message = "Phone is required." });

            var user = _context.Users.FirstOrDefault(u => u.PhoneNumber == request.Phone);
            if (user == null || string.IsNullOrWhiteSpace(user.Email))
                return BadRequest(new { message = "User not found or email missing." });

            var result = _otpService.SendOtp(user.Email);
            return Ok(new { message = result, phone = request.Phone, gmail = user.Email });
        }

        // Xác thực OTP
        [HttpPost("verify-otp")]
        [AllowAnonymous]
        public IActionResult VerifyOtp([FromBody] VerifyOtpDTO request)
        {
            var token = _otpService.VerifyOtpAndReturnToken(request.Email, request.Otpcode);

            if (token == null)
                return BadRequest(new { message = "OTP invalid, expired, or user not found." });

            return Ok(new { token }); // ✅ trả về token trong JSON
        }
    }

    public class SendOtpRequest
    {
        public string Phone { get; set; }
    }

    public class VerifyOtpDTO
    {
        public string Email { get; set; }
        public string Otpcode { get; set; }
    }

}
