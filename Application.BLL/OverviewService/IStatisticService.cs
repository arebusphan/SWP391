using DAL.Models.StatisticDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.OverviewService
{
    public interface IStatisticService
    {
        OverviewStatisticDto GetOverviewStatistics();
    }
}