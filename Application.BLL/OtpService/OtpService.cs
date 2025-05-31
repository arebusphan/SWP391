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
namespace BLL.OtpService

{
    public class OtpService
    {
        private readonly IAuthService _authservice;
        private readonly AppDbContext _context;

        public OtpService(AppDbContext context, IAuthService authService)
        {
            _authservice = authService;
            _context = context;
        }

        public string SaveOtp(string gmail, string otpcode, DateTime expireat)
        {
            var user = _context.Users.FirstOrDefault(x => x.Email == gmail);
            if (user == null)
                throw new Exception("User not found");
            var otp = new Otps
            {
                
                Code = otpcode,
                ExpiredAt = expireat,
                UserId =  user.UserId

            };
            _context.Otps.Add(otp);
            _context.SaveChanges();
            return gmail;
        }
        public string GenerateOtp()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }
        public string SendOtpEmail(string toEmail, string otp)
        {
            try
            {
                var fromEmail = "dungarebus@gmail.com";
                var appPassword = "upuh qnjm qbct pryp";

                var client = new SmtpClient("smtp.gmail.com", 587)
                {
                    EnableSsl = true,
                    Credentials = new NetworkCredential(fromEmail, appPassword)
                };

                var mail = new MailMessage(fromEmail, toEmail)
                {
                    Subject = "Your Otp ",
                    Body = $"Your Otp is: {otp}",
                    IsBodyHtml = false
                };

                client.Send(mail);
                return "OTP sent";
            }
            catch (Exception ex)
            {
                return $"Lỗi gửi OTP: {ex.Message}";
            }
        }
        public string SendOtpByPhone(string phone)
        {
            var user = _context.Users.FirstOrDefault(u => u.PhoneNumber == phone);

            if (user == null || string.IsNullOrEmpty(user.Email))
            {
                return "Cant find this pople use this phone.";
            }

            var otp = GenerateOtp();
            var expireAt = DateTime.Now.AddMinutes(5);

            SaveOtp(user.Email, otp, expireAt);


            var sendResult = SendOtpEmail(user.Email, otp);
            return sendResult;
        }
        public string VerifyOtpAndReturnToken(string email, string otpcode)
        {
            var otpRecord = _context.Otps
    .Include(o => o.User) 
    .OrderByDescending(o => o.UserId)
    .FirstOrDefault(o =>
        o.User.Email.ToLower() == email.ToLower() &&
        o.Code == otpcode.Trim());
            if (otpRecord == null)
            {
                Console.WriteLine("OTP not found.");
                return null;
            }
            if (otpRecord.ExpiredAt < DateTime.UtcNow)
            {
                Console.WriteLine("OTP expired.");
                return null;
            }

            var user = _context.Users.Include(u=>u.Role).FirstOrDefault(u => u.UserId == otpRecord.UserId);
            if (user == null)
            {
                Console.WriteLine("User not exist this.");
                return null;
            }

            var token = _authservice.CreateToken(user);
            return token;
        }

    }

}