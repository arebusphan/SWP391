using DAL;
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

}
