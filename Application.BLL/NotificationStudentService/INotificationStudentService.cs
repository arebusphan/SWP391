public interface INotificationStudentService
{
    Task<List<NotificationStudentVM>> GetConfirmationByClassAsync(int notificationId, int classId);
}
