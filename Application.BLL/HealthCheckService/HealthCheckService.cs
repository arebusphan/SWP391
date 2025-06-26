using DAL.Models;
using DAL.Repositories;
using DTOs;

namespace BLL.HealthCheckService
{
    public class HealthCheckService : IHealthCheckService
    {
        private readonly IHealthCheckRepository _healthRepo;

        public HealthCheckService(IHealthCheckRepository healthRepo)
        {
            _healthRepo = healthRepo;
        }

        public void SubmitHealthCheck(HealthCheckDto dto)
        {
            if (!_healthRepo.StudentExists(dto.StudentId))
                throw new Exception("Student not found");

            var check = new HealthChecks
            {
                StudentId = dto.StudentId,
                CheckDate = dto.CheckDate,
                WeightKg = dto.WeightKg,
                HeightCm = dto.HeightCm,
                LeftEyeVision = dto.LeftEyeVision,
                RightEyeVision = dto.RightEyeVision,
                LeftEarHearing = dto.LeftEarHearing,
                RightEarHearing = dto.RightEarHearing,
                SpineStatus = dto.SpineStatus,
                SkinStatus = dto.SkinStatus,
                OralHealth = dto.OralHealth,
                OtherNotes = dto.OtherNotes,
                RecordedBy = dto.RecordedBy,
                
            };

            _healthRepo.AddHealthCheck(check);
        }
        public List<HealthCheckDto> GetHealthChecksByGuardian(int guardianId)
        {
            var studentIds = _healthRepo.GetStudentIdsByGuardian(guardianId);
            var records = _healthRepo.GetByStudentIds(studentIds);

            return records.Select(h => new HealthCheckDto
            {
                StudentId = h.StudentId,
                StudentName = h.Student?.FullName ?? "",
                CheckDate = h.CheckDate,
                WeightKg = h.WeightKg,
                HeightCm = h.HeightCm,
                LeftEyeVision = h.LeftEyeVision,
                RightEyeVision = h.RightEyeVision,
                LeftEarHearing = h.LeftEarHearing,
                RightEarHearing = h.RightEarHearing,
                SpineStatus = h.SpineStatus,
                SkinStatus = h.SkinStatus,
                OralHealth = h.OralHealth,
                OtherNotes = h.OtherNotes,
                RecordedBy = h.RecordedBy,

                // ➕ Gán thông tin lớp học nếu có
                ClassId = h.Student?.ClassId ?? 0,
                ClassName = h.Student?.Class?.ClassName ?? "-"
            }).ToList();
        }



    }
}
