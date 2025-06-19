using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class MedicationIntakeLogDto
    {
        public int LogId { get; set; }
        public DateTime IntakeTime { get; set; }
        public string? GivenBy { get; set; }
        public string? Notes { get; set; }

        // Optional: thêm thông tin liên quan
        public int RequestId { get; set; }
        public int StudentId { get; set; }
    }
}
