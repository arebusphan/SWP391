using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace DAL.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        private readonly AppDbContext _context;

        public StudentRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<Students> GetStudentsByGuardian(int guardianId)
        {
            return _context.Students
                .Include(s => s.Guardian)
                .Where(s => s.GuardianId == guardianId)
                .ToList();
        }
        public List<StudentBasicInfoDTO> GetAllBasicProfiles()
        {
            return _context.Students
                .Include(s => s.Guardian)
                .Select(s => new StudentBasicInfoDTO
                {
                    StudentId = s.StudentId,
                    FullName = s.FullName,
                    Gender = s.Gender,
                    DateOfBirth = s.DateOfBirth,
                    GuardianName = s.Guardian.FullName,
                    GuardianPhone = s.Guardian.PhoneNumber
                })
                .ToList();
        }
        public async Task AddAsync(List<Students> students)
        {
            await _context.Students.AddRangeAsync(students);
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<StudentDTO>> GetByClassIdAsync(int classId)
        {
            return await _context.Students
                .Include(s => s.Guardian) // Lấy thêm thông tin người giám hộ
                .Where(s => s.ClassId == classId)
                .Select(s => new StudentDTO
                {
                    StudentId = s.StudentId,
                    FullName = s.FullName,
                    DateOfBirth = s.DateOfBirth,
                    Gender = s.Gender,
                    GuardianId = s.Guardian.UserId,
                    GuardianName = s.Guardian.FullName,
                    GuardianPhone = s.Guardian.PhoneNumber
                })
                .ToListAsync(); // Trả về dưới dạng List, nhưng kiểu trả về là IEnumerable => OK
        }

        public async Task<List<StudentDTO>> GetStudentDTOsAsync()
        {
            return await _context.Students
                .Include(s => s.Guardian)
                .Select(s => new StudentDTO
                {
                    StudentId = s.StudentId,
                    FullName = s.FullName,
                    DateOfBirth = s.DateOfBirth,
                    Gender = s.Gender,
                    GuardianId = s.Guardian.UserId,
                    GuardianName = s.Guardian.FullName,
                    GuardianPhone = s.Guardian.PhoneNumber
                })
                .ToListAsync();
        }

    }
}
