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
        return await (
            from s in _context.Students
            join c in _context.Classes on s.ClassId equals c.ClassId
            join ns in _context.NotificationStudents on s.StudentId equals ns.StudentId
            join vr in _context.VaccinationResults
                on new { s.StudentId, ns.NotificationId } equals new { vr.StudentId, vr.NotificationId } into vrGroup
            from vr in vrGroup.DefaultIfEmpty() // left join để vẫn có học sinh chưa tiêm
            where ns.NotificationId == notificationId
                  && s.ClassId == classId
                  && ns.ConfirmStatus == "Confirmed"
            select new VaccinationResultVM
            {
                StudentId = s.StudentId,
                StudentName = s.FullName,
                ClassName = c.ClassName,
                ConfirmStatus = ns.ConfirmStatus,
                Vaccinated = vr.Vaccinated,
                VaccinatedDate = vr.VaccinatedDate,
                ObservationStatus = vr.ObservationStatus
            }
        ).ToListAsync();
    }




}
