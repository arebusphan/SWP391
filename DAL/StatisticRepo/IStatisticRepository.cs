using DAL.Models.StatisticDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.StatisticRepo
{
    public interface IStatisticRepository
    {
        OverviewStatisticDto GetOverviewStatistics();
    }
}
