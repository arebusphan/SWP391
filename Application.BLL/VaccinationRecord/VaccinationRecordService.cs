using DTOs;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class VaccinationRecordService : IVaccinationRecordService
{
    private readonly IVaccinationRecordRepository _repository;

    public VaccinationRecordService(IVaccinationRecordRepository repository)
    {
        _repository = repository;
    }

    // Thêm bản ghi tiêm chủng theo VaccineId
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

    // Thêm bản ghi tiêm chủng theo VaccineName
    public async Task AddVaccinationByNameAsync(VaccinationRecordDto dto)
    {
        var vaccine = await _repository.GetVaccineByNameAsync(dto.VaccineName);
        if (vaccine == null)
            throw new Exception("Vaccine not found!");

        var record = new VaccinationRecord
        {
            StudentId = dto.StudentId,
            VaccineId = vaccine.VaccineId,
            VaccinationDate = dto.VaccinationDate,
            Notes = dto.Notes
        };

        await _repository.AddRecordAsync(record);
    }

    // Lấy lịch sử tiêm chủng cho học sinh
    public async Task<List<VaccinationRecordDto>> GetVaccinationsAsync(int studentId)
    {
        var records = await _repository.GetRecordsByStudentIdAsync(studentId);
        return records.Select(r => new VaccinationRecordDto
        {
            StudentId = r.StudentId,
            VaccineId = r.VaccineId,
            VaccinationDate = r.VaccinationDate,
            Notes = r.Notes,
            VaccineName = r.Vaccine?.VaccineName
        }).ToList();
    }
}
