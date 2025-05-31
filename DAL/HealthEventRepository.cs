using DAL.Models;
using DAL;
using Microsoft.EntityFrameworkCore;


public class HealthEventRepository : IHealthEventRepository
{
    private readonly AppDbContext _context;

    public HealthEventRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddHealthEventAsync(HealthEvent healthEvent)
    {
        _context.HealthEvents.Add(healthEvent);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<HealthEvent>> GetEventsByStudentIdAsync(int studentId)
    {
        return await _context.HealthEvents
            .Where(e => e.StudentId == studentId)
            .ToListAsync();
    }
}
