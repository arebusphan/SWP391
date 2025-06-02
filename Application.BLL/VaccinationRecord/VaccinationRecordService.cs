using DTOs;

public class VaccinationRecordService : IVaccinationRecordService
{
    private readonly IVaccinationRecordRepository _repository;

    public VaccinationRecordService(IVaccinationRecordRepository repository)
    {
        _repository = repository;
    }

    public async Task AddVaccinationAsync(VaccinationRecordDto dto)
    {
        var record = new VaccinationRecord
        {
            StudentId = dto.StudentId,
            VaccineId = dto.VaccineId,
            VaccinationDate = dto.VaccinationDate,
            Notes = dto.Notes
        };

        await _repository.AddRecordAsync(record);
    }

    public async Task<List<VaccinationRecordDto>> GetVaccinationsAsync(int studentId)
    {
        var records = await _repository.GetRecordsByStudentIdAsync(studentId);
        return records.Select(r => new VaccinationRecordDto
        {
            StudentId = r.StudentId,
            VaccineId = r.VaccineId,
            VaccinationDate = r.VaccinationDate,
            Notes = r.Notes
        }).ToList();
    }
}
