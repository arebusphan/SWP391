using System.Collections.Generic;
using System.Threading.Tasks;

public interface IHealthEventSupplyRepository
{
    Task AddHealthEventSupplyAsync(HealthEventSupply entity);
    Task<IEnumerable<HealthEventSupply>> GetSuppliesByEventIdAsync(int eventId);
    Task<IEnumerable<HealthEventSupply>> GetAllSuppliesAsync();
    Task DeleteHealthEventSupplyAsync(int id);
    Task UpdateHealthEventSupplyAsync(HealthEventSupply entity);
}