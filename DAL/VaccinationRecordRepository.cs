using DAL;
using DAL.Models;
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
        try
        {
            _context.VaccinationRecords.Add(record);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine("❌ Error when saving record: " + ex.Message);
            throw;
        }
    }


    public async Task<List<VaccinationRecord>> GetRecordsByStudentIdAsync(int studentId)
    {
        return await _context.VaccinationRecords
            .Where(r => r.StudentId == studentId)
            .Include(r => r.Vaccine) // nếu muốn lấy tên vaccine
            .ToListAsync();
    }
    public async Task<Vaccine> GetVaccineByNameAsync(string vaccineName)
    {
        return await _context.Vaccines.FirstOrDefaultAsync(v => v.VaccineName == vaccineName);
    }

}
