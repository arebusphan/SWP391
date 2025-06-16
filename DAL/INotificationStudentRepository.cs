public interface INotificationStudentRepository
{
    Task<List<NotificationStudentVM>> GetConfirmationByClassAsync(int notificationId, int classId);
}
