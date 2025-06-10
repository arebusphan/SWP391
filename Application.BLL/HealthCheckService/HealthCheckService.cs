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
                RecordedBy = dto.RecordedBy
            };

            _healthRepo.AddHealthCheck(check);
        }
    }
}
