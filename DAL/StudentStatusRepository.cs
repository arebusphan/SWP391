using DAL.Models; // Import các lớp model từ namespace DAL.Models
using Microsoft.EntityFrameworkCore; // Sử dụng EF Core để truy vấn và bao gồm liên kết
using System.Collections.Generic;
using System.Linq;

namespace DAL.Repositories
{
    // Repository để xử lý logic lấy thông tin tình trạng sức khỏe học sinh
    public class StudentStatusRepository : IStudentStatusRepository
    {
        private readonly AppDbContext _context; // Context để kết nối cơ sở dữ liệu

        // Constructor nhận vào AppDbContext để sử dụng trong các phương thức
        public StudentStatusRepository(AppDbContext context)
        {
            _context = context;
        }

        // Lấy danh sách tình trạng sức khỏe của các học sinh có guardian (phụ huynh) tương ứng
        public List<StudentHealthStatusDTO> GetStudentStatusByGuardian(int guardianId)
        {
            // Truy vấn danh sách học sinh có GuardianId phù hợp, bao gồm HealthChecks và ConsultationAppointments
            var students = _context.Students
                .Include(s => s.HealthChecks) // Bao gồm các lần kiểm tra sức khỏe
                .Include(s => s.ConsultationAppointments) // Bao gồm các lần tư vấn
                .Where(s => s.GuardianId == guardianId) // Lọc theo guardianId
                .ToList(); // Chuyển kết quả thành danh sách

            // Chuyển dữ liệu sang dạng DTO
            var result = students.Select(s => new StudentHealthStatusDTO
            {
                StudentId = s.StudentId,
                FullName = s.FullName,
                Gender = s.Gender,
                DateOfBirth = s.DateOfBirth,

                // Lấy ngày khám sức khỏe gần nhất
                LatestHealthCheckDate = s.HealthChecks.OrderByDescending(h => h.CheckDate).FirstOrDefault()?.CheckDate,

                // Lấy cân nặng, chiều cao gần nhất (nếu có)
                WeightKg = (float?)s.HealthChecks.OrderByDescending(h => h.CheckDate).FirstOrDefault()?.WeightKg,
                HeightCm = (float?)s.HealthChecks.OrderByDescending(h => h.CheckDate).FirstOrDefault()?.HeightCm,

                // Kiểm tra học sinh có cuộc hẹn tư vấn nào không
                HasConsultation = s.ConsultationAppointments.Any(),

                // Lấy ngày tư vấn gần nhất
                ConsultationDate = s.ConsultationAppointments.OrderByDescending(c => c.AppointmentDate).FirstOrDefault()?.AppointmentDate
            }).ToList();

            return result; // Trả về danh sách DTO
        }

        // Lấy tình trạng sức khỏe của tất cả học sinh trong hệ thống
        public List<StudentHealthStatusDTO> GetAllStudentStatus()
        {
            // Truy vấn toàn bộ học sinh cùng với dữ liệu sức khỏe và tư vấn
            var students = _context.Students
                .Include(s => s.HealthChecks) // Bao gồm các lần kiểm tra sức khỏe
                .Include(s => s.ConsultationAppointments) // Bao gồm các cuộc hẹn tư vấn
                .ToList();

            // Chuyển sang DTO để sử dụng bên ngoài
            var result = students.Select(s => new StudentHealthStatusDTO
            {
                StudentId = s.StudentId,
                FullName = s.FullName,
                Gender = s.Gender,
                DateOfBirth = s.DateOfBirth,

                // Lấy dữ liệu kiểm tra sức khỏe gần nhất
                LatestHealthCheckDate = s.HealthChecks.OrderByDescending(h => h.CheckDate).FirstOrDefault()?.CheckDate,
                WeightKg = (float?)s.HealthChecks.OrderByDescending(h => h.CheckDate).FirstOrDefault()?.WeightKg,
                HeightCm = (float?)s.HealthChecks.OrderByDescending(h => h.CheckDate).FirstOrDefault()?.HeightCm,

                // Kiểm tra có cuộc tư vấn nào không
                HasConsultation = s.ConsultationAppointments.Any(),
                ConsultationDate = s.ConsultationAppointments.OrderByDescending(c => c.AppointmentDate).FirstOrDefault()?.AppointmentDate
            }).ToList();

            return result; // Trả về danh sách tình trạng sức khỏe của tất cả học sinh
        }

    }
}
