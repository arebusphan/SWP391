using DAL.Models; // Sử dụng các model như Students, Guardian, v.v.
using Microsoft.EntityFrameworkCore; // Dùng để truy vấn dữ liệu với Include và async
using System.Collections.Generic;
using System.Linq;

namespace DAL.Repositories
{
    // Repository xử lý các thao tác liên quan đến bảng Students
    public class StudentRepository : IStudentRepository
    {
        private readonly AppDbContext _context; // EF DbContext dùng để truy vấn dữ liệu

        // Constructor truyền DbContext vào
        public StudentRepository(AppDbContext context)
        {
            _context = context;
        }

        // Lấy danh sách học sinh theo mã người giám hộ
        public List<Students> GetStudentsByGuardian(int guardianId)
        {
            return _context.Students
                .Include(s => s.Guardian) // Bao gồm thông tin người giám hộ
                .Where(s => s.GuardianId == guardianId) // Lọc theo GuardianId
                .ToList(); // Trả về danh sách học sinh
        }

        // Lấy danh sách thông tin cơ bản của tất cả học sinh (DTO)
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
                .Include(s => s.Guardian) // Bao gồm Guardian để lấy thông tin liên quan
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
                .ToListAsync(); // Trả về danh sách DTO đầy đủ
        }
        public async Task<string?> GetGuardianEmailByStudentIdAsync(int studentId)
        {
            var student = _context.Students
                .Include(s => s.Guardian)
                .FirstOrDefault(s => s.StudentId == studentId);

            return student?.Guardian?.Email;
        }

    }
}
