using DAL.Models;

public interface INotificationStudentRepository
{
    Task<List<NotificationStudentVM>> GetConfirmationByClassAsync(int notificationId, int classId);
    bool UpdateConfirmation(VaccineConfirmination dto);
    List<VaccineConfirmInfo> GetPendingConfirmationsByGuardian(int guardianUserId);
}
