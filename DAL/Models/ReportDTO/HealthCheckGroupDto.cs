using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models.ReportDTO
{
    public class HealthCheckGroupDto
    {
        public string ClassName { get; set; }
        public string ResultCategory { get; set; } // Ví dụ: "Bình thường", "Cần theo dõi"
        public int Count { get; set; }
    }
}
