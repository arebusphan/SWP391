using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Models;
using DAL;

namespace BLL.StudentService
{
    public class StudentService : IStudentService
    {
        private readonly AppDbContext _context;

        public StudentService(AppDbContext context)
        {
            _context = context;
        }

        public List<StudentDTO> GetStudentsByGuardian(int guardianId)
        {
            return _context.Students
                .Where(s => s.GuardianId == guardianId)
                .Select(s => new StudentDTO
                {
                    StudentId = s.StudentId,
                    FullName = s.FullName,
                    DateOfBirth = s.DateOfBirth,
                    Gender = s.Gender
                })
                .ToList();
        }
    }
}
