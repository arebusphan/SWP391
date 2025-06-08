using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class HealthEventSupplyService : IHealthEventSupplyService
{
    private readonly IHealthEventSupplyRepository _repository;

    public HealthEventSupplyService(IHealthEventSupplyRepository repository)
    {
        _repository = repository;
    }

    public async Task RecordHealthEventSupplyAsync(HealthEventSupplyDTO dto)
    {
        var entity = new HealthEventSupply
        {
            EventId = dto.EventId,
            SupplyId = dto.SupplyId,
            QuantityUsed = dto.QuantityUsed
        };

        await _repository.AddHealthEventSupplyAsync(entity);
    }

    public async Task<IEnumerable<HealthEventSupplyDTO>> GetSuppliesByEventIdAsync(int eventId)
    {
        var supplies = await _repository.GetSuppliesByEventIdAsync(eventId);
        return supplies.Select(s => new HealthEventSupplyDTO
        {
            EventSupplyId = s.EventSupplyId,
            EventId = s.EventId,
            SupplyId = s.SupplyId,
            QuantityUsed = s.QuantityUsed
        });
    }

    public async Task<IEnumerable<HealthEventSupplyDTO>> GetAllSuppliesAsync()
    {
        var supplies = await _repository.GetAllSuppliesAsync();
        return supplies.Select(s => new HealthEventSupplyDTO
        {
            EventSupplyId = s.EventSupplyId,
            EventId = s.EventId,
            SupplyId = s.SupplyId,
            QuantityUsed = s.QuantityUsed
        });
    }

    public async Task DeleteHealthEventSupplyAsync(int id)
    {
        await _repository.DeleteHealthEventSupplyAsync(id);
    }

    public async Task UpdateHealthEventSupplyAsync(HealthEventSupplyDTO dto)
    {
        var entity = new HealthEventSupply
        {
            EventSupplyId = dto.EventSupplyId,
            EventId = dto.EventId,
            SupplyId = dto.SupplyId,
            QuantityUsed = dto.QuantityUsed
        };

        await _repository.UpdateHealthEventSupplyAsync(entity);
    }
}
