using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace DAL.Repositories
{
    public class StudentStatusRepository : IStudentStatusRepository
    {
        private readonly AppDbContext _context;

        public StudentStatusRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<StudentHealthStatusDTO> GetStudentStatusByGuardian(int guardianId)
        {
            var students = _context.Students
               
                .Include(s => s.HealthChecks)
                .Include(s => s.ConsultationAppointments)
                .Where(s => s.GuardianId == guardianId)
                .ToList();

            var result = students.Select(s => new StudentHealthStatusDTO
            {
                StudentId = s.StudentId,
                FullName = s.FullName,
                Gender = s.Gender,
                DateOfBirth = s.DateOfBirth,

               

                LatestHealthCheckDate = s.HealthChecks.OrderByDescending(h => h.CheckDate).FirstOrDefault()?.CheckDate,
                WeightKg = (float?)s.HealthChecks.OrderByDescending(h => h.CheckDate).FirstOrDefault()?.WeightKg,
                HeightCm = (float?)s.HealthChecks.OrderByDescending(h => h.CheckDate).FirstOrDefault()?.HeightCm,


                HasConsultation = s.ConsultationAppointments.Any(),
                ConsultationDate = s.ConsultationAppointments.OrderByDescending(c => c.AppointmentDate).FirstOrDefault()?.AppointmentDate
            }).ToList();

            return result;
        }
        public List<StudentHealthStatusDTO> GetAllStudentStatus()
        {
            var students = _context.Students
                
                .Include(s => s.HealthChecks)
                .Include(s => s.ConsultationAppointments)
                .ToList();

            var result = students.Select(s => new StudentHealthStatusDTO
            {
                StudentId = s.StudentId,
                FullName = s.FullName,
                Gender = s.Gender,
                DateOfBirth = s.DateOfBirth,

                

                LatestHealthCheckDate = s.HealthChecks.OrderByDescending(h => h.CheckDate).FirstOrDefault()?.CheckDate,
                WeightKg = (float?)s.HealthChecks.OrderByDescending(h => h.CheckDate).FirstOrDefault()?.WeightKg,
                HeightCm = (float?)s.HealthChecks.OrderByDescending(h => h.CheckDate).FirstOrDefault()?.HeightCm,

                HasConsultation = s.ConsultationAppointments.Any(),
                ConsultationDate = s.ConsultationAppointments.OrderByDescending(c => c.AppointmentDate).FirstOrDefault()?.AppointmentDate
            }).ToList();

            return result;
        }

    }
}
