public class VaccinationResultService : IVaccinationResultService
{
    private readonly IVaccinationResultRepository _repo;
    public VaccinationResultService(IVaccinationResultRepository repo) => _repo = repo;

    public Task SaveResultAsync(VaccinationResults result) => _repo.SaveResultAsync(result);
}
