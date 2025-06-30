using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DAL;
using DAL.Models;
using DAL.Models;
using BLL.AuthService;
using static System.Net.WebRequestMethods;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;
namespace BLL.OtpService

{
    public class OtpService
    {
        private readonly EmailService _emailService;
        private readonly IMemoryCache _memoryCache;
        private readonly AppDbContext _context;
        private readonly IAuthService _authService;

        public OtpService(IConfiguration config, IMemoryCache memoryCache, AppDbContext context, IAuthService authService)
        {
            var settings = EmailConfigHelper.GetEmailSettings(config);
            _emailService = new EmailService(settings);
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

    public string SendOtp(string email)
    {
        string otp = GenerateSecureOtp();
        TimeSpan expiryTime = TimeSpan.FromSeconds(90); // 1 phút 30 giây

        _memoryCache.Set($"otp_{email}", otp, expiryTime);

        string message = $"Your OTP code is: {otp}\nThis code is valid for 1 minute 30 seconds.";
        return _emailService.SendEmail(email, "Your OTP", message);
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
                        return _authService.CreateToken(user); // ✅ tạo token tại đây
                    }
                }
            }
            return null;
        }
    }
 }