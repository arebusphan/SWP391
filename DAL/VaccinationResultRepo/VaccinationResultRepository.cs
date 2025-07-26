using DAL; // Sử dụng namespace chứa lớp AppDbContext và các entity
using Microsoft.EntityFrameworkCore; // Sử dụng để thao tác với Entity Framework Core, như truy vấn async

public class VaccinationResultRepository : IVaccinationResultRepository
{
    private readonly AppDbContext _context;

    // Constructor nhận context để thao tác với database
    public VaccinationResultRepository(AppDbContext context) => _context = context;

    // Phương thức lưu kết quả tiêm chủng vào CSDL
    public async Task SaveResultAsync(VaccinationResults result)
    {
        // Tìm bản ghi tiêm chủng đã tồn tại theo StudentId và NotificationId
        var existing = await _context.VaccinationResults
            .FirstOrDefaultAsync(r => r.StudentId == result.StudentId && r.NotificationId == result.NotificationId);

        if (existing != null)
        {
            // Nếu đã tồn tại thì cập nhật thông tin
            existing.Vaccinated = result.Vaccinated;
            existing.VaccinatedDate = result.VaccinatedDate;
            existing.ObservationStatus = result.ObservationStatus;
            existing.VaccinatedBy = result.VaccinatedBy;
        }
        else
        {
            // Nếu chưa có thì thêm mới bản ghi
            _context.VaccinationResults.Add(result);
        }

        // Lưu thay đổi vào CSDL
        await _context.SaveChangesAsync();
    }

    // Phương thức lấy danh sách kết quả tiêm của học sinh theo đợt thông báo và lớp
    public async Task<List<VaccinationResultVM>> GetResultsByNotificationAsync(int notificationId, int classId)
    {
        return await (
            from s in _context.Students // Truy vấn từ bảng học sinh
            join c in _context.Classes on s.ClassId equals c.ClassId // Join với lớp học
            join ns in _context.NotificationStudents on s.StudentId equals ns.StudentId // Join với thông tin học sinh trong thông báo
            join vr in _context.VaccinationResults
                on new { s.StudentId, ns.NotificationId } equals new { vr.StudentId, vr.NotificationId } into vrGroup
            from vr in vrGroup.DefaultIfEmpty() // Sử dụng left join để lấy cả học sinh chưa có kết quả tiêm
            where ns.NotificationId == notificationId // Lọc theo ID thông báo
                  && s.ClassId == classId // Lọc theo lớp
                  && ns.ConfirmStatus == "Confirmed" // Chỉ lấy học sinh đã xác nhận tiêm
            select new VaccinationResultVM
            {
                // Dựng view model để hiển thị dữ liệu
                StudentId = s.StudentId,
                StudentName = s.FullName,
                ClassName = c.ClassName,
                ConfirmStatus = ns.ConfirmStatus,
                Vaccinated = vr.Vaccinated,
                VaccinatedDate = vr.VaccinatedDate,
                ObservationStatus = vr.ObservationStatus
            }
        ).ToListAsync(); // Chuyển kết quả truy vấn thành danh sách

    }
    // DAL Implementation: Truy vấn danh sách kết quả tiêm của học sinh theo guardian
    public async Task<List<VaccinationResultVM>> GetResultsByGuardianAsync(int guardianId)
    {
        return await (
            from s in _context.Students
            join c in _context.Classes on s.ClassId equals c.ClassId
            join ns in _context.NotificationStudents on s.StudentId equals ns.StudentId
            join vr in _context.VaccinationResults
                on new { s.StudentId, ns.NotificationId } equals new { vr.StudentId, vr.NotificationId } into vrGroup
            from vr in vrGroup.DefaultIfEmpty() // Left join: học sinh chưa tiêm vẫn được hiển thị
            where s.GuardianId == guardianId
            select new VaccinationResultVM
            {
                StudentId = s.StudentId,
                StudentName = s.FullName,
                ClassName = c.ClassName,
                ConfirmStatus = ns.ConfirmStatus,
                Vaccinated = vr.Vaccinated,
                VaccinatedDate = vr.VaccinatedDate,
                ObservationStatus = vr.ObservationStatus
            }
        ).ToListAsync();
    }

}
