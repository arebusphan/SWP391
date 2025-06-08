using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

public interface IHealthEventSupplyService
{
    Task RecordHealthEventSupplyAsync(HealthEventSupplyDTO dto);
    Task<IEnumerable<HealthEventSupplyDTO>> GetSuppliesByEventIdAsync(int eventId);
    Task<IEnumerable<HealthEventSupplyDTO>> GetAllSuppliesAsync();
    Task DeleteHealthEventSupplyAsync(int id);
    Task UpdateHealthEventSupplyAsync(HealthEventSupplyDTO dto);
}
