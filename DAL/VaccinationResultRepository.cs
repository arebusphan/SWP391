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

    public async Task<List<VaccinationResultVM>> GetResultsByNotificationAsync(int notificationId, int classId)
    {
        return await (from s in _context.Students
                      where s.ClassId == classId
                      join r in _context.VaccinationResults
                          .Where(r => r.NotificationId == notificationId)
                          on s.StudentId equals r.StudentId into resultJoin
                      from r in resultJoin.DefaultIfEmpty()
                      select new VaccinationResultVM
                      {
                          StudentId = s.StudentId,
                          StudentName = s.FullName,
                          ClassName = s.Class.ClassName,
                          Vaccinated = r != null ? r.Vaccinated : null,
                          VaccinatedDate = r != null ? r.VaccinatedDate : null,
                          ObservationStatus = r != null ? r.ObservationStatus : null
                      }).ToListAsync();
    }


}
