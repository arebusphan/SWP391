using DAL.Models;

public interface IVaccinationRecordRepository
{
    Task AddRecordAsync(VaccinationRecord record);
    Task<List<VaccinationRecord>> GetRecordsByStudentIdAsync(int studentId);
    Task<Vaccine> GetVaccineByNameAsync(string vaccineName); // Thêm hàm này
}
