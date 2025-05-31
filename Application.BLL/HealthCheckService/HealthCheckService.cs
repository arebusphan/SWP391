using DAL;
using DAL.Models;
using System;
using System.Linq;

namespace BLL.HealthCheckService
{
    public class HealthCheckService : IHealthCheckService
    {
        private readonly AppDbContext _context;

        public HealthCheckService(AppDbContext context)
        {
            _context = context;
        }

        public void SubmitHealthProfile(int studentId, HealthProfileDTO dto, int recordedBy)
        {
            var student = _context.Students.FirstOrDefault(s => s.StudentId == studentId);
            if (student == null)
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

            _context.HealthChecks.Add(profile);
            _context.SaveChanges();
        }
    }
}
