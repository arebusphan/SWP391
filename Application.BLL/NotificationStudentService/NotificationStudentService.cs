public class NotificationStudentService : INotificationStudentService
{
    private readonly INotificationStudentRepository _repo;
    public NotificationStudentService(INotificationStudentRepository repo) => _repo = repo;

    public Task<List<NotificationStudentVM>> GetConfirmationByClassAsync(int notificationId, int classId)
        => _repo.GetConfirmationByClassAsync(notificationId, classId);
}
