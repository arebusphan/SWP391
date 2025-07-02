using System;
using System.Text;
using System.Security.Cryptography;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.EntityFrameworkCore;
using BLL.EmailService; // chứa IEmailService
using DAL;
using DAL.Models;
using BLL.AuthService;
using System.Threading.Tasks;

namespace BLL.OtpService
{
    public class OtpService
    {
        private readonly IEmailService _emailService;
        private readonly IMemoryCache _memoryCache;
        private readonly AppDbContext _context;
        private readonly IAuthService _authService;

        // Inject IEmailService thay vì tự new EmailService
        public OtpService(IEmailService emailService, IMemoryCache memoryCache, AppDbContext context, IAuthService authService)
        {
            _emailService = emailService;
            _memoryCache = memoryCache;
            _context = context;
            _authService = authService;
        }

        private string GenerateSecureOtp()
        {
            var otpBuilder = new StringBuilder();
            byte[] randomBytes = new byte[1];

            while (otpBuilder.Length < 6)
            {
                RandomNumberGenerator.Fill(randomBytes);
                int digit = randomBytes[0] % 10;
                otpBuilder.Append(digit);
            }

            return otpBuilder.ToString(); // e.g., "048392"
        }

        public async Task<string> SendOtp(string email)
        {
            string otp = GenerateSecureOtp();
            TimeSpan expiryTime = TimeSpan.FromSeconds(90); // 1 phút 30 giây

            _memoryCache.Set($"otp_{email}", otp, expiryTime);

            string message = $"Your OTP code is: {otp}\nThis code is valid for 1 minute 30 seconds.";
            return await _emailService.SendEmailAsync(email, "Your OTP", message);
        }

        public string VerifyOtpAndReturnToken(string email, string inputOtp)
        {
            if (_memoryCache.TryGetValue($"otp_{email}", out string correctOtp))
            {
                if (correctOtp == inputOtp)
                {
                    var user = _context.Users.Include(u => u.Role).FirstOrDefault(u => u.Email == email);
                    if (user != null)
                    {
                        return _authService.CreateToken(user); // tạo token tại đây
                    }
                }
            }
            return null;
        }
    }
}
