using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models.ReportDTO
{
    public class IncidentGroupDto
    {
        public string ClassName { get; set; }
        public string IncidentType { get; set; } // Ngã, Sốt, Khác
        public int Count { get; set; }
    }
}
