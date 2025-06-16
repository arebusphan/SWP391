using DAL;
using Microsoft.EntityFrameworkCore;
using DAL.Models;
public class HealthNotificationRepository : IHealthNotificationRepository
{
    private readonly AppDbContext _context;
    public HealthNotificationRepository(AppDbContext context) => _context = context;

    public async Task<int> CreateAsync(HealthNotification notification, List<int> classIds)
    {
        _context.HealthNotifications.Add(notification);
        await _context.SaveChangesAsync();

        foreach (var classId in classIds)
        {
            _context.NotificationClasses.Add(new NotificationClass
            {
                NotificationId = notification.NotificationId,
                ClassId = classId
            });
        }

        await _context.SaveChangesAsync();
        return notification.NotificationId;
    }

    // ✅ Trả về lịch sử theo DTO
    public async Task<List<NotificationHistoryDTO>> GetNotificationHistoriesAsync()
    {
        var data = await _context.NotificationClasses
            .Include(nc => nc.Notification)
            .Include(nc => nc.Class)
            .Select(nc => new NotificationHistoryDTO
            {
                Id = nc.Notification.NotificationId,
                EventName = nc.Notification.EventName,
                EventType = nc.Notification.EventType,
                EventDate = nc.Notification.EventDate,
                ClassName = nc.Class.ClassName,
                EventImage = nc.Notification.EventImage // thêm dòng này
            })
            .ToListAsync();

        return data;
    }

}
