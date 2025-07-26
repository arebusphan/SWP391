using Microsoft.EntityFrameworkCore;
using DAL.Models;
public interface IHealthNotificationRepository
{
    Task<int> CreateAsync(HealthNotification notification, List<int> classIds);
    Task<List<NotificationHistoryDTO>> GetNotificationHistoriesAsync(); // ✅
    Task<List<HealthNotificationBasicDTO>> GetAllBasicAsync();

}
