public interface IVaccinationResultService
{
    Task SaveResultAsync(VaccinationResults result);
    Task<List<VaccinationResultVM>> GetResultsByNotificationAsync(int notificationId, int classId);
}
