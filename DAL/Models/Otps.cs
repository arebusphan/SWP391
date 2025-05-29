using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Otps
    {
        [Key]
        public int OtpId { get; set; }
        public int UserId { get; set; }
        public string Code { get; set; }
        public DateTime ExpiredAt { get; set; }
        Boolean IsUsed { get; set; }
        public Users User { get; set; }
    }
}
