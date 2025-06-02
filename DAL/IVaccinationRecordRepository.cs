public interface IVaccinationRecordRepository
{
    Task AddRecordAsync(VaccinationRecord record);
    Task<List<VaccinationRecord>> GetRecordsByStudentIdAsync(int studentId);
}
