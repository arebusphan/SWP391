using DAL;
using Microsoft.EntityFrameworkCore;
public class VaccinationResultRepository : IVaccinationResultRepository
{
    private readonly AppDbContext _context;
    public VaccinationResultRepository(AppDbContext context) => _context = context;

    public async Task SaveResultAsync(VaccinationResults result)
    {
        var existing = await _context.VaccinationResults
            .FirstOrDefaultAsync(r => r.StudentId == result.StudentId && r.NotificationId == result.NotificationId);

        if (existing != null)
        {
            existing.Vaccinated = result.Vaccinated;
            existing.VaccinatedDate = result.VaccinatedDate;
            existing.ObservationStatus = result.ObservationStatus;
            existing.VaccinatedBy = result.VaccinatedBy;
        }
        else
        {
            _context.VaccinationResults.Add(result);
        }

        await _context.SaveChangesAsync();
    }
}
