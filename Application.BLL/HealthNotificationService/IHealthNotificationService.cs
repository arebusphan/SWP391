using DAL.Models;
public interface IHealthNotificationService

{
    Task<int> CreateNotificationAsync(HealthNotification notification, List<int> classIds);
    Task<List<NotificationHistoryDTO>> GetNotificationHistoriesAsync(); // ✅
    Task<List<HealthNotificationBasicDTO>> GetAllBasicNotificationsAsync();

}
