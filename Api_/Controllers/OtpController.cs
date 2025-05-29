using Microsoft.AspNetCore.Mvc;
using BLL.OtpService;
using DAL;
using DAL.Models;

namespace YourApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OtpController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly OtpService _otpService;

        public OtpController(AppDbContext context,
            OtpService otpService)
        {
            _context = context;
            _otpService = otpService;
        }
        [HttpPost("send")]
        public IActionResult SendOtp([FromBody] SendOtpRequest request)
        {
            var result = _otpService.SendOtpByPhone(request.phone);


            var user = _context.Users.FirstOrDefault(u => u.Phone == request.phone);

            if (user == null)
            {

                return BadRequest(new { message = "User not found" });
            }


            return Ok(new { message = result, gmail = user.gmail });
        }
        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp([FromBody] VerifyOtpDTO request)
        {
            var token = _otpService.VerifyOtpAndReturnToken(request.gmail, request.Otpcode);

            if (token == null)
                return BadRequest("OTP invalid or time out.");

            return Ok(new { Token = token });
        }

    }
    public class SendOtpRequest
    {
        public string phone { get; set; }
    }


}
