using DTOs;
public interface IVaccinationRecordService
{
    Task AddVaccinationAsync(VaccinationRecordDto dto);
    Task<List<VaccinationRecordDto>> GetVaccinationsAsync(int studentId);
}
