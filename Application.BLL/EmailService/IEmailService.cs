using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.EmailService
{
    public interface IEmailService
    {
        Task<List<string>> SendEmailAsync(List<EmailMessageDto> personalizedMessages);
        Task<string> SendEmailAsync(string toEmail, string subject, string body, bool isHtml = false);
    }
}
