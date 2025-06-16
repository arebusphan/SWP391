using DAL;

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
}