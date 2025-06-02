using DAL;
using Microsoft.EntityFrameworkCore;

public class VaccinationRecordRepository : IVaccinationRecordRepository
{
    private readonly AppDbContext _context;

    public VaccinationRecordRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddRecordAsync(VaccinationRecord record)
    {
        _context.VaccinationRecords.Add(record);
        await _context.SaveChangesAsync();
    }

    public async Task<List<VaccinationRecord>> GetRecordsByStudentIdAsync(int studentId)
    {
        return await _context.VaccinationRecords
            .Where(r => r.StudentId == studentId)
            .Include(r => r.Vaccine) // nếu muốn lấy tên vaccine
            .ToListAsync();
    }
}
