using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class VaccineConfirmination
    {
        public int NotificationStudentId { get; set; }
        public string ConfirmStatus { get; set; } // "Confirmed" hoặc "Declined"
        public string ParentPhone { get; set; }
        public string? DeclineReason { get; set; } // Chỉ khi từ chối

    }
}
