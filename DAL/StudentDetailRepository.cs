using DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class StudentDetailRepository : IStudentDetailRepository
    {
        private readonly AppDbContext _context;

        public StudentDetailRepository(AppDbContext context)
        {
            _context = context;
        }

        public StudentDetailDto GetStudentDetail(int studentId)
        {
            var student = _context.Students
                .Include(s => s.Guardian)
                .Include(s => s.HealthProfile)
                
                .FirstOrDefault(s => s.StudentId == studentId);

            if (student == null) return null;

            return new StudentDetailDto
            {
                StudentId = student.StudentId,
                FullName = student.FullName,
                Gender = student.Gender,
                DateOfBirth = student.DateOfBirth,
                GuardianName = student.Guardian?.FullName ?? "",
                GuardianPhone = student.Guardian?.PhoneNumber ?? "",
                Allergies = student.HealthProfile?.Allergies ?? "",
                ChronicDiseases = student.HealthProfile?.ChronicDiseases ?? "",
                Vision = student.HealthProfile?.Vision ?? "",
                Hearing = student.HealthProfile?.Hearing ?? "",
               

            };
        }
    }
}
