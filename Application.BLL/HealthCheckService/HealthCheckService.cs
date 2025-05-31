using DAL.Models;
using DAL.Repositories;

namespace BLL.HealthCheckService
{
    public class HealthCheckService : IHealthCheckService
    {
        private readonly IHealthCheckRepository _healthRepo;

        public HealthCheckService(IHealthCheckRepository healthRepo)
        {
            _healthRepo = healthRepo;
        }

        public void SubmitHealthProfile(int studentId, HealthProfileDTO dto, int recordedBy)
        {
            if (!_healthRepo.StudentExists(studentId))
                throw new Exception("Student not found");

            var profile = new HealthChecks
            {
                StudentId = studentId,
                CheckDate = DateTime.Now,
                LeftEyeVision = dto.LeftEyeVision,
                RightEyeVision = dto.RightEyeVision,
                LeftEarHearing = dto.LeftEarHearing,
                RightEarHearing = dto.RightEarHearing,
                SpineStatus = dto.SpineStatus,
                SkinStatus = dto.SkinStatus,
                OralHealth = dto.OralHealth,
                OtherNotes = dto.OtherNotes,
                RecordedBy = recordedBy
            };

            _healthRepo.AddHealthCheck(profile);
        }
    }
}
