using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models.ReportDTO
{
    public class VaccineStatusGroupDto
    {
        public string ClassName { get; set; }
        public string Status { get; set; } // "Đã tiêm" hoặc "Chưa tiêm"
        public int Count { get; set; }
    }
}
