using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace BLL.OtpService
{
    public class EmailService
    {
        private readonly EmailSettings _settings;

        public EmailService(EmailSettings settings)
        {
            _settings = settings;
        }

        public string SendEmail(string toEmail, string subject, string body, bool isHtml = false)
        {
            try
            {
                var client = new SmtpClient(_settings.SmtpServer, _settings.SmtpPort)
                {
                    EnableSsl = true,
                    Credentials = new NetworkCredential(_settings.FromEmail, _settings.AppPassword)
                };

                var mail = new MailMessage(_settings.FromEmail, toEmail)
                {
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = isHtml
                };

                client.Send(mail);
                return "Email sent successfully.";
            }
            catch (Exception ex)
            {
                return $"Failed to send email: {ex.Message}";
            }
        }
    }
}
