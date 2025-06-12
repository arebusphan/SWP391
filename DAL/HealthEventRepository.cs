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
        bool studentExists = await _context.Students.AnyAsync(s => s.StudentId == healthEvent.StudentId);
        if (!studentExists)
        {
            throw new ArgumentException($"StudentId {healthEvent.StudentId} không tồn tại.");
        }

        _context.HealthEvents.Add(healthEvent);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<HealthEvent>> GetEventsByStudentIdAsync(int studentId)
    {
        return await _context.HealthEvents
            .Where(e => e.StudentId == studentId)
            .Include(e => e.Supplies)
            .ToListAsync();
    }
    public async Task<IEnumerable<HealthEvent>> GetAllEventsAsync()
    {
        return await _context.HealthEvents
            .Include(e => e.Student)
            .Include(e => e.Supplies)
            .ToListAsync();
    }
    public async Task DeleteHealthEventAsync(int eventId)
    {
        var entity = await _context.HealthEvents
            .Include(e => e.Supplies) // load liên kết
            .FirstOrDefaultAsync(e => e.EventId == eventId);

        if (entity != null)
        {
            // Xóa liên kết trước (nếu không có cascade)
            if (entity.Supplies != null && entity.Supplies.Any())
            {
                _context.HealthEventSupplies.RemoveRange(entity.Supplies);
            }

            _context.HealthEvents.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }

    public async Task UpdateHealthEventAsync(HealthEvent entity)
    {
        bool studentExists = await _context.Students.AnyAsync(s => s.StudentId == entity.StudentId);
        if (!studentExists)
        {
            throw new ArgumentException($"StudentId {entity.StudentId} không tồn tại.");
        }

        var existing = await _context.HealthEvents.FindAsync(entity.EventId);
        if (existing == null)
            throw new KeyNotFoundException("Không tìm thấy HealthEvent.");

        // Cập nhật thủ công để tránh lỗi ghi đè toàn bộ
        existing.EventDate = entity.EventDate;
        existing.Description = entity.Description;
        existing.StudentId = entity.StudentId;
        existing.EventType = entity.EventType;
        existing.Execution = entity.Execution;
        existing.EventId = entity.EventId;

        await _context.SaveChangesAsync();
    }
}