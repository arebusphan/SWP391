using DAL.Models.StatisticDTO;
using DAL.StatisticRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.OverviewService
{
    public class StatisticService : IStatisticService
    {
        private readonly IStatisticRepository _repository;

        public StatisticService(IStatisticRepository repository)
        {
            _repository = repository;
        }

        public OverviewStatisticDto GetOverviewStatistics()
        {
            return _repository.GetOverviewStatistics();
        }
    }
}
