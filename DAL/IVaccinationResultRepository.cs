public interface IVaccinationResultRepository
{
    Task SaveResultAsync(VaccinationResults result);
}
