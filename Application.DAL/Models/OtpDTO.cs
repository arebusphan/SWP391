using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class OtpDTO
    {
        public string Gmail { get; set; }

        public string Otpcode { get; set; }
        public DateTime Expireat { get; set; }
    }
}
