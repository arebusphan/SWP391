public class VaccinationResultService : IVaccinationResultService
{
    private readonly IVaccinationResultRepository _repo;
    public VaccinationResultService(IVaccinationResultRepository repo) => _repo = repo;

    public Task SaveResultAsync(VaccinationResults result) => _repo.SaveResultAsync(result);

    public Task<List<VaccinationResultVM>> GetResultsByNotificationAsync(int notificationId, int classId)
        => _repo.GetResultsByNotificationAsync(notificationId, classId);

    public Task<List<VaccinationResultVM>> GetResultsByGuardianAsync(int guardianId)
        => _repo.GetResultsByGuardianAsync(guardianId);
}