using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.OtpService
{
    public static class EmailConfigHelper
    {
        public static EmailSettings GetEmailSettings(IConfiguration config)
        {
            return new EmailSettings
            {
                FromEmail = config["EmailSettings:FromEmail"],
                AppPassword = config["EmailSettings:AppPassword"],
                SmtpServer = config["EmailSettings:SmtpServer"],
                SmtpPort = int.Parse(config["EmailSettings:SmtpPort"])
            };
        }
    }
}
