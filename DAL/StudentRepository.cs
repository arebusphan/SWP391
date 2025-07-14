using DAL.Models; 
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace DAL.Repositories
{
    // Repository xử lý các thao tác liên quan đến bảng Students
    public class StudentRepository : IStudentRepository
    {
        private readonly AppDbContext _context; 

        // Constructor truyền DbContext vào
        public StudentRepository(AppDbContext context)
        {
            _context = context;
        }

        // Lấy danh sách học sinh theo mã người giám hộ
        public List<Students> GetStudentsByGuardian(int guardianId)
        {
            return _context.Students
                .Include(s => s.Class)     // ✅ THÊM dòng này để có thông tin lớp học
                .Include(s => s.Guardian)  // Bao gồm thông tin người giám hộ
                .Where(s => s.GuardianId == guardianId)
                .ToList(); // Trả về danh sách học sinh
        }



        public List<StudentBasicInfoDTO> GetAllBasicProfiles()
        {
            return _context.Students
                .Include(s => s.Guardian)
                .Include(s => s.Class)

                .Select(s => new StudentBasicInfoDTO
                {
                    StudentId = s.StudentId,
                    FullName = s.FullName,
                    Gender = s.Gender,
                    DateOfBirth = s.DateOfBirth,
                    GuardianName = s.Guardian.FullName,
                    GuardianPhone = s.Guardian.PhoneNumber,
                    ClassName = s.Class.ClassName
                })
                .ToList(); // Trả về danh sách DTO
        }

        // Thêm nhiều học sinh vào cơ sở dữ liệu (danh sách)
        public async Task AddAsync(List<Students> students)
        {
            await _context.Students.AddRangeAsync(students); // Thêm danh sách học sinh
            await _context.SaveChangesAsync(); // Lưu vào DB
        }

        // Lấy danh sách học sinh trong một lớp theo ClassId, trả về DTO
        public async Task<IEnumerable<StudentDTO>> GetByClassIdAsync(int classId)
        {
            return await _context.Students
                .Include(s => s.Guardian) // Bao gồm Guardian
                .Where(s => s.ClassId == classId) // Lọc theo lớp
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
                .ToListAsync(); // Trả về danh sách DTO (kiểu IEnumerable vẫn hợp lệ)
        }

        // Lấy toàn bộ danh sách học sinh dưới dạng DTO, không lọc theo lớp hay guardian
        public async Task<List<StudentDTO>> GetStudentDTOsAsync()
        {
            return await _context.Students
                .Include(s => s.Guardian)
                .Include(s => s.Class) // 👈 Bao gồm thông tin Class
                .Select(s => new StudentDTO
                {
                    StudentId = s.StudentId,
                    FullName = s.FullName,
                    DateOfBirth = s.DateOfBirth,
                    Gender = s.Gender,
                    GuardianId = s.Guardian.UserId,
                    GuardianName = s.Guardian.FullName,
                    GuardianPhone = s.Guardian.PhoneNumber,
                    ClassName = s.Class.ClassName,
                    ClassId = s.Class.ClassId 
                })
                .ToListAsync();
        }

        public async Task<Students?> GetGuardianEmailByStudentIdAsync(int studentId)
        {
            return await _context.Students
       .Include(s => s.Guardian)
       .Include(s => s.Class)
       .FirstOrDefaultAsync(s => s.StudentId == studentId);
        }
        public async Task<List<Students>> GetStudentsWithGuardianAndClassAsync(List<int> studentIds)
        {
            return await _context.Students
                .Include(s => s.Guardian)
                .Include(s => s.Class)
                .Where(s => studentIds.Contains(s.StudentId))
                .ToListAsync();
        }
        public async Task<List<Students>> GetByClassIdsAsync(List<int> classIds)
        {
            return await _context.Students
                .Include(s => s.Class)
                .Include(s => s.Guardian)
                .Where(s => classIds.Contains(s.ClassId))
                .ToListAsync();
        }
        public async Task UpdateAsync(Students student)
        {
            _context.Students.Update(student);
           _context.SaveChanges();
        }
    }
}
