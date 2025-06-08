using DAL;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class HealthEventSupplyRepository : IHealthEventSupplyRepository
{
    private readonly AppDbContext _context;

    public HealthEventSupplyRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddHealthEventSupplyAsync(HealthEventSupply entity)
    {
        await _context.HealthEventSupplies.AddAsync(entity);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<HealthEventSupply>> GetSuppliesByEventIdAsync(int eventId)
    {
        return await _context.HealthEventSupplies
            .Where(s => s.EventId == eventId)
            .ToListAsync();
    }

    public async Task<IEnumerable<HealthEventSupply>> GetAllSuppliesAsync()
    {
        return await _context.HealthEventSupplies.ToListAsync();
    }

    public async Task DeleteHealthEventSupplyAsync(int id)
    {
        var entity = await _context.HealthEventSupplies.FindAsync(id);
        if (entity != null)
        {
            _context.HealthEventSupplies.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }

    public async Task UpdateHealthEventSupplyAsync(HealthEventSupply entity)
    {
        _context.HealthEventSupplies.Update(entity);
        await _context.SaveChangesAsync();
    }
}