using DAL.Models;


public class NotificationStudentService : INotificationStudentService
{
    private readonly INotificationStudentRepository _repo;
    public NotificationStudentService(INotificationStudentRepository repo) => _repo = repo;

    public Task<List<NotificationStudentVM>> GetConfirmationByClassAsync(int notificationId, int classId)
        => _repo.GetConfirmationByClassAsync(notificationId, classId);
    public bool ConfirmVaccination(VaccineConfirmination dto)
    {
        return _repo.UpdateConfirmation(dto);
    }
    public List<VaccineConfirmInfo> GetPendingVaccinationsByGuardian(int guardianUserId)
    {
        return _repo.GetPendingConfirmationsByGuardian(guardianUserId);
    }
}
