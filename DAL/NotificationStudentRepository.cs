using DAL;
using Microsoft.EntityFrameworkCore;

public class NotificationStudentRepository : INotificationStudentRepository
{
    private readonly AppDbContext _context;
    public NotificationStudentRepository(AppDbContext context) => _context = context;

    public async Task<List<NotificationStudentVM>> GetConfirmationByClassAsync(int notificationId, int classId)
    {
        var studentIds = await _context.StudentClasses
            .Where(sc => sc.ClassId == classId)
            .Select(sc => sc.StudentId)
            .ToListAsync();

        var result = await (from ns in _context.NotificationStudents
                            join s in _context.Students on ns.StudentId equals s.StudentId
                            where ns.NotificationId == notificationId && studentIds.Contains(s.StudentId)
                            select new NotificationStudentVM
                            {
                                StudentId = s.StudentId,
                                StudentName = s.FullName,
                                ConfirmStatus = ns.ConfirmStatus,
                                DeclineReason = ns.DeclineReason,
                                ParentPhone = ns.ParentPhone
                            }).ToListAsync();

        return result;
    }
}
