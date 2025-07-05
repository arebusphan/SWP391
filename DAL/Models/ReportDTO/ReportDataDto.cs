using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models.ReportDTO
{
    public class ReportDataDto
    {
        public List<Dictionary<string, object>> Bar { get; set; }
        public List<PieItemDto> Pie { get; set; }
    }
}
