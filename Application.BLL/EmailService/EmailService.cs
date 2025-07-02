using BLL.EmailService;
using DAL.Models;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

 public class EmailService : IEmailService
{
    private readonly EmailSettings _settings;

    public EmailService(IOptions<EmailSettings> options)
    {
        _settings = options.Value;
    }

    public async Task<string> SendEmailAsync(List<string> toList, string subject, string body, bool isHtml = false)
    {
        try
        {
            using var client = new SmtpClient(_settings.SmtpServer, _settings.SmtpPort)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(_settings.FromEmail, _settings.AppPassword)
            };

            var mail = new MailMessage()
            {
                From = new MailAddress(_settings.FromEmail),
                Subject = subject,
                Body = body,
                IsBodyHtml = isHtml
            };

            foreach (var to in toList)
            {
                if (!string.IsNullOrWhiteSpace(to))
                    mail.To.Add(to.Trim());
            }

            if (mail.To.Count == 0)
                return "No valid recipient.";

            await client.SendMailAsync(mail);
            return "Emails sent successfully.";
        }
        catch (Exception ex)
        {
            return $"Failed to send emails: {ex.Message}";
        }
    }

    public Task<string> SendEmailAsync(string toEmail, string subject, string body, bool isHtml = false)
    {
        return SendEmailAsync(new List<string> { toEmail }, subject, body, isHtml);
    }
}

