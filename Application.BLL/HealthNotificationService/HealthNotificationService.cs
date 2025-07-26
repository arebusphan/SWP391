using BLL.EmailService;
using DAL.EmailRepo;
using DAL.Models;
using DAL.StudentRepo;
public class HealthNotificationService : IHealthNotificationService


{
    private readonly IHealthNotificationRepository _repo;
    private readonly IEmailService _emailService;
    private readonly IStudentRepository _studentRepository;
    private readonly IEmailQueue _emailQueue;
    public HealthNotificationService(IHealthNotificationRepository repo, IEmailService emailservice,IStudentRepository studentRepository, IEmailQueue emailQueue)
    {
        _repo = repo;
        _emailService = emailservice;
        _studentRepository = studentRepository;
        _emailQueue = emailQueue;
    }

    public async Task<int> CreateNotificationAsync(HealthNotification notification, List<int> classIds)
    {
        // B1: Tạo notification trong DB
        var notificationId = await _repo.CreateAsync(notification, classIds);

        // B2: Lấy danh sách học sinh có Guardian và Class
        var studentList = await _studentRepository.GetByClassIdsAsync(classIds);

        // B3: Chuẩn bị email cá nhân hóa
        var eventDate = notification.EventDate.ToString("dd/MM/yyyy");

        var messages = studentList
            .Where(s => s.Guardian != null && !string.IsNullOrWhiteSpace(s.Guardian.Email))
            .Select(s =>
            {
                string body = $@"
<p>Dear <strong>{s.Guardian.FullName}</strong>, parent of <strong>{s.FullName}</strong>,</p>
<p><strong>{notification.EventName}</strong></p>
<p>Student: <strong>{s.FullName}</strong></p>
<p>Class: <strong>{s.Class.ClassName}</strong></p>";

                if (notification.EventType == "Vaccination")
                {
                    body += $@"
<p>The school will organize a vaccination event for students on <strong>{eventDate}</strong>.</p>
<p>Please log in to the application to confirm whether you agree or decline the vaccination.</p>
<p style='color: red;'><em>Note: If no confirmation is made within 3 days, the system will automatically mark it as declined.</em></p>";
                }
                else if (notification.EventType == "HealthCheck")
                {
                    body += $@"
<p>The school will conduct a health check for students on <strong>{eventDate}</strong>.</p>";
                }

                return new EmailMessageDto
                {
                    ToList = s.Guardian.Email,
                    Subject = $"[Notification] {notification.EventName}",
                    Body = body,
                    IsHtml = true
                };
            })
            .ToList();

        // ✅ B4: Đưa vào hàng đợi (fire-and-forget)
        _emailQueue.Enqueue(messages);

        return notificationId;
    }




    public Task<List<NotificationHistoryDTO>> GetNotificationHistoriesAsync()
        => _repo.GetNotificationHistoriesAsync(); // ✅
    public Task<List<HealthNotificationBasicDTO>> GetAllBasicNotificationsAsync()
    => _repo.GetAllBasicAsync();

}
