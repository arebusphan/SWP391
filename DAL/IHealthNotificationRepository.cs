public interface IHealthNotificationRepository
{
    Task<int> CreateAsync(HealthNotification notification, List<int> classIds);
}