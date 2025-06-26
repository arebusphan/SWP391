using DAL.Models;

public interface INotificationStudentService
{
    Task<List<NotificationStudentVM>> GetConfirmationByClassAsync(int notificationId, int classId);
    bool ConfirmVaccination(VaccineConfirmination dto);
    List<VaccineConfirmInfo> GetPendingVaccinationsByGuardian(int guardianUserId);
}
