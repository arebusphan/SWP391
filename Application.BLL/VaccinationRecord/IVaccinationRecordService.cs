using DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IVaccinationRecordService
{
    Task AddVaccinationAsync(VaccinationRecordDto dto);              // Nhập trực tiếp VaccineId
    Task AddVaccinationByNameAsync(VaccinationRecordDto dto);        // Nhập theo VaccineName
    Task<List<VaccinationRecordDto>> GetVaccinationsAsync(int studentId);
}
