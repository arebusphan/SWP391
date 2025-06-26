using DAL;
using DAL.Models;
using Microsoft.EntityFrameworkCore;

public class NotificationStudentRepository : INotificationStudentRepository
{
    private readonly AppDbContext _context;
    public NotificationStudentRepository(AppDbContext context) => _context = context;

    public async Task<List<NotificationStudentVM>> GetConfirmationByClassAsync(int notificationId, int classId)
    {
        var result = await _context.NotificationStudents
            .Where(ns => ns.NotificationId == notificationId && ns.Student.ClassId == classId)
            .Select(ns => new NotificationStudentVM
            {
                StudentId = ns.StudentId,
                StudentName = ns.Student.FullName,
                ConfirmStatus = ns.ConfirmStatus,
                DeclineReason = ns.DeclineReason,
                ParentPhone = ns.ParentPhone
            })
            .ToListAsync();

        return result;
    }
    public bool UpdateConfirmation(VaccineConfirmination dto)
    {
        var record = _context.NotificationStudents
            .FirstOrDefault(ns => ns.Id == dto.NotificationStudentId);

        if (record == null)
            return false;

        record.ConfirmStatus = dto.ConfirmStatus;
        record.ParentPhone = dto.ParentPhone;
        record.DeclineReason = dto.ConfirmStatus == "Declined" ? dto.DeclineReason : null;

        _context.SaveChanges();
        return true;
    }
    public List<VaccineConfirmInfo> GetPendingConfirmationsByGuardian(int guardianUserId)
    {
        var result = _context.NotificationStudents
            .Include(ns => ns.Student)
                .ThenInclude(s => s.Class)
            .Include(ns => ns.Notification)
            .Where(ns =>
                (ns.ConfirmStatus == null || ns.ConfirmStatus == "Pending") &&
                ns.Student.GuardianId == guardianUserId &&
                ns.Notification.EventType == "Vaccination"
            )
            .Select(ns => new VaccineConfirmInfo
            {
                NotificationStudentId = ns.Id,
                NotificationId = ns.NotificationId,
                EventName = ns.Notification.EventName,
                EventType = ns.Notification.EventType,
                EventImage = ns.Notification.EventImage,
                EventDate = ns.Notification.EventDate,
                CreatedAt = (DateTime)ns.Notification.CreatedAt,
                CreatedBy = ns.Notification.CreatedBy,

                StudentId = ns.StudentId,
                StudentName = ns.Student.FullName,
                ClassName = ns.Student.Class.ClassName
            })
            .ToList();

        return result;
    }
}
