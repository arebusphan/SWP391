public interface IHealthNotificationService
{
    Task<int> CreateNotificationAsync(HealthNotification notification, List<int> classIds);
}
