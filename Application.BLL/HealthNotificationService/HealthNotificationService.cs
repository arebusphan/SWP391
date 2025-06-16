public class HealthNotificationService : IHealthNotificationService
{
    private readonly IHealthNotificationRepository _repo;
    public HealthNotificationService(IHealthNotificationRepository repo) => _repo = repo;

    public Task<int> CreateNotificationAsync(HealthNotification notification, List<int> classIds)
        => _repo.CreateAsync(notification, classIds);
}