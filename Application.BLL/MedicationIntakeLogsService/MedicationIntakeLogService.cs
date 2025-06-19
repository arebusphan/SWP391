using DAL.MedicationIntakeLogs;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.MedicationIntakeLogsService
{
    public class MedicationIntakeLogService : IMedicationIntakeLogService
    {
        private readonly IMedicationIntakeLogRepo _logRepo;

        public MedicationIntakeLogService(IMedicationIntakeLogRepo logRepo)
        {
            _logRepo = logRepo;
        }

        public async Task<IEnumerable<MedicationIntakeLogDto>> GetLogsByStudentIdAsync(int studentId)
        {
            var logs = await _logRepo.GetLogsByStudentIdAsync(studentId);

            // Thủ công ánh xạ từng entity -> DTO
            return logs.Select(log => new MedicationIntakeLogDto
            {
                LogId = log.LogId,
                RequestId = log.RequestId,
                StudentId = log.StudentId,
                IntakeTime = log.IntakeTime,
                GivenBy = log.GivenBy,
                Notes = log.Notes
            }).ToList();
        }

        public async Task<MedicationIntakeLogDto> CreateLogAsync(MedicationIntakeLogCreateDto dto)
        {
            var entity = new MedicationIntakeLog
            {
                RequestId = dto.RequestId,
                StudentId = dto.StudentId,
                GivenBy = dto.GivenBy,
                Notes = dto.Notes,
                IntakeTime = DateTime.Now
            };

            var created = await _logRepo.CreateLogAsync(entity);

            return new MedicationIntakeLogDto
            {
                LogId = created.LogId,
                RequestId = created.RequestId,
                StudentId = created.StudentId,
                IntakeTime = created.IntakeTime,
                GivenBy = created.GivenBy,
                Notes = created.Notes
            };
        }
    }
}
