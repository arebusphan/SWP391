using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.OtpService
{
    public class EmailSettings
    {
        public string FromEmail { get; set; }
        public string AppPassword { get; set; }
        public string SmtpServer { get; set; }
        public int SmtpPort { get; set; }
    }
}
