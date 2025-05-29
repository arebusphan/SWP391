using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
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

        public void SaveOtp(string gmail, string otpcode, DateTime expireat)
        {
            var otp = new Otp
            {
                Gmail = gmail,
                Otpcode = otpcode,
                Expireat = expireat
            };
            _context.otp.Add(otp);
            _context.SaveChanges();
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
            var user = _context.Users.FirstOrDefault(u => u.Phone == phone);

            if (user == null || string.IsNullOrEmpty(user.gmail))
            {
                return "Cant find this pople use this phone.";
            }

            var otp = GenerateOtp();
            var expireAt = DateTime.Now.AddMinutes(5);

            SaveOtp(user.gmail, otp, expireAt);


            var sendResult = SendOtpEmail(user.gmail, otp);
            return sendResult;
        }
        public string VerifyOtpAndReturnToken(string email, string otpcode)
        {
            var otpRecord = _context.otp
                .OrderByDescending(o => o.otpId)
                .FirstOrDefault(o => o.Gmail.ToLower() == email.ToLower() && o.Otpcode == otpcode.Trim());

            if (otpRecord == null)
            {
                Console.WriteLine("OTP not found.");
                return null;
            }
            if (otpRecord.Expireat < DateTime.UtcNow)
            {
                Console.WriteLine("OTP expired.");
                return null;
            }

            var user = _context.Users.FirstOrDefault(u => u.gmail.ToLower() == otpRecord.Gmail.ToLower());
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