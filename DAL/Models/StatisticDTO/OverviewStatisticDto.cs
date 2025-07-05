using DAL.Models.ReportDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models.StatisticDTO
{
    public class OverviewStatisticDto
    {
        public List<StatCardDto> StatCards { get; set; }
        public List<BarItemDto> BarData { get; set; }
        public List<PieItemDto> MedicationPie { get; set; }
        public List<PieItemDto> VaccinePie { get; set; }
    }
}
