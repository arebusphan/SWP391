using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.EmailService
{
    public interface IEmailService
    {
        Task<string> SendEmailAsync(List<string> toList, string subject, string body, bool isHtml = false);
        Task<string> SendEmailAsync(string toEmail, string subject, string body, bool isHtml = false);
    }
}
