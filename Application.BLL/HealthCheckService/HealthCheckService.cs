using DAL.EmailRepo;
using DAL.Models;
using DAL.StudentRepo;
using DTOs;

namespace BLL.HealthCheckService
{
    public class HealthCheckService : IHealthCheckService
    {
        private readonly IHealthCheckRepository _healthRepo;
        private readonly IStudentRepository _studentRepository;
        private readonly IEmailQueue _emailQueue;

        public HealthCheckService(IHealthCheckRepository healthRepo, IStudentRepository studentRepository,IEmailQueue emailQueue)
        {
            _healthRepo = healthRepo;
            _studentRepository = studentRepository;
            _emailQueue = emailQueue;
        }

        public async Task SubmitHealthCheckAsync(HealthCheckDto dto)
        {
            if (!_healthRepo.StudentExists(dto.StudentId))
                throw new Exception("Student not found");

            var check = new HealthChecks
            {
                StudentId = dto.StudentId,
                CheckDate = dto.CheckDate,
                WeightKg = dto.WeightKg,
                HeightCm = dto.HeightCm,
                LeftEyeVision = dto.LeftEyeVision,
                RightEyeVision = dto.RightEyeVision,
                LeftEarHearing = dto.LeftEarHearing,
                RightEarHearing = dto.RightEarHearing,
                SpineStatus = dto.SpineStatus,
                SkinStatus = dto.SkinStatus,
                OralHealth = dto.OralHealth,
                OtherNotes = dto.OtherNotes,
                RecordedBy = dto.RecordedBy,
            };

            // Lưu thông tin health check
            await _healthRepo.AddHealthCheckAsync(check);

            // Lấy info phụ huynh & học sinh
            var studentWithGuardian = await _studentRepository.GetGuardianEmailByStudentIdAsync(dto.StudentId);
            if (studentWithGuardian?.Guardian == null || string.IsNullOrWhiteSpace(studentWithGuardian.Guardian.Email))
                return; // không có email gửi

            // Soạn mail
            string body = $@"
<html>
<body style='font-family: Arial, sans-serif;'>
    <h2 style='color: #2a4365;'>Health Check Notification</h2>
    <p>Dear <strong>{studentWithGuardian.Guardian.FullName}</strong>,</p>
    <p>This is to inform you that your child <strong>{studentWithGuardian.FullName}</strong> from class <strong>{studentWithGuardian.Class.ClassName}</strong> has completed a health check on <strong>{dto.CheckDate:dd/MM/yyyy}</strong>.</p>
    <p><strong>Weight:</strong> {dto.WeightKg} kg</p>
    <p><strong>Height:</strong> {dto.HeightCm} cm</p>
    <p><strong>Left Eye Vision:</strong> {dto.LeftEyeVision}</p>
    <p><strong>Right Eye Vision:</strong> {dto.RightEyeVision}</p>
    <p><strong>Left Ear Hearing:</strong> {dto.LeftEarHearing}</p>
    <p><strong>Right Ear Hearing:</strong> {dto.RightEarHearing}</p>
    <p><strong>Spine Status:</strong> {dto.SpineStatus}</p>
    <p><strong>Skin Status:</strong> {dto.SkinStatus}</p>
    <p><strong>Oral Health:</strong> {dto.OralHealth}</p>
    <p><strong>Other Notes:</strong> {dto.OtherNotes}</p>
    <p>Thank you,<br/>School Health Services</p>
</body>
</html>";

            // Đưa vào hàng đợi gửi mail giống cái UpdateRequestStatus
            _emailQueue.Enqueue(new EmailMessageDto
            {
                ToList = studentWithGuardian.Guardian.Email,
                Subject = $"[Health Check] {studentWithGuardian.FullName}",
                Body = body,
                IsHtml = true
            });
        }



        public List<HealthCheckDto> GetHealthChecksByGuardian(int guardianId)
        {
            var studentIds = _healthRepo.GetStudentIdsByGuardian(guardianId);
            var records = _healthRepo.GetByStudentIds(studentIds);

            return records.Select(h => new HealthCheckDto
            {
                StudentId = h.StudentId,
                StudentName = h.Student?.FullName ?? "",
                CheckDate = h.CheckDate,
                WeightKg = h.WeightKg,
                HeightCm = h.HeightCm,
                LeftEyeVision = h.LeftEyeVision,
                RightEyeVision = h.RightEyeVision,
                LeftEarHearing = h.LeftEarHearing,
                RightEarHearing = h.RightEarHearing,
                SpineStatus = h.SpineStatus,
                SkinStatus = h.SkinStatus,
                OralHealth = h.OralHealth,
                OtherNotes = h.OtherNotes,
                RecordedBy = h.RecordedBy,

                // ➕ Gán thông tin lớp học nếu có
                ClassId = h.Student?.ClassId ?? 0,
                ClassName = h.Student?.Class?.ClassName ?? "-"
            }).ToList();
        }



    }
}
