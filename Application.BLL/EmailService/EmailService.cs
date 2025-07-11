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

    // ✅ Gửi 1 người — giữ lại để hệ thống dùng
    public async Task<string> SendEmailAsync(string toEmail, string subject, string body, bool isHtml = false)
    {
        try
        {
            using var client = new SmtpClient(_settings.SmtpServer, _settings.SmtpPort)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(_settings.FromEmail, _settings.AppPassword)
            };

            var mail = new MailMessage
            {
                From = new MailAddress(_settings.FromEmail),
                Subject = subject,
                Body = body,
                IsBodyHtml = isHtml
            };

            mail.To.Add(toEmail.Trim());

            await client.SendMailAsync(mail);
            return $"✅ Sent to {toEmail}";
        }
        catch (Exception ex)
        {
            return $"❌ Failed to send to {toEmail}: {ex.Message}";
        }
    }

    // ✅ Gửi nhiều người, mỗi người 1 nội dung (cá nhân hóa)
    public async Task<List<string>> SendEmailAsync(List<EmailMessageDto> personalizedMessages)
    {
        var results = new List<string>();

        foreach (var msg in personalizedMessages)
        {
            if (string.IsNullOrWhiteSpace(msg.ToList))
            {
                results.Add("❌ Skipped empty recipient.");
                continue;
            }

            try
            {
                using var client = new SmtpClient(_settings.SmtpServer, _settings.SmtpPort)
                {
                    EnableSsl = true,
                    Credentials = new NetworkCredential(_settings.FromEmail, _settings.AppPassword)
                };

                var mail = new MailMessage
                {
                    From = new MailAddress(_settings.FromEmail),
                    Subject = msg.Subject,
                    Body = msg.Body,
                    IsBodyHtml = msg.IsHtml
                };

                mail.To.Add(msg.ToList.Trim());

                await client.SendMailAsync(mail);
                results.Add($"✅ Sent to {msg.ToList}");
            }
            catch (Exception ex)
            {
                results.Add($"❌ Failed to send to {msg.ToList}: {ex.Message}");
            }
        }

        return results;
    }

}
