using DAL.EmailRepo;
using DAL.Models;
using DAL.Repositories;
using Microsoft.EntityFrameworkCore;

public class VaccinationResultService : IVaccinationResultService
{
    private readonly IVaccinationResultRepository _repo;
    private readonly IStudentRepository _studentRepository;
    private readonly IEmailQueue _emailQueue;
    public VaccinationResultService(IVaccinationResultRepository repo, IStudentRepository studentRepository,IEmailQueue emailQueue)
    {
        _repo = repo;
        _studentRepository = studentRepository;
        _emailQueue = emailQueue;
    }

    public async Task SaveResultAsync(VaccinationResults result)
    {
        // B1: Lưu vào DB
        await _repo.SaveResultAsync(result);

        // B2: Lấy thông tin học sinh + Guardian + Class
        var studinfo = await _studentRepository.GetGuardianEmailByStudentIdAsync(result.StudentId);

        if (studinfo.Guardian == null || string.IsNullOrWhiteSpace(studinfo.Guardian.Email))
            return;

        // B3: Soạn nội dung email tùy theo trạng thái vaccinated
        string body;
        string subject;

        if (result.Vaccinated == true)
        {
            subject = $"[Vaccination Result] {studinfo.FullName}";
            body = $@"
<html>
<body style='font-family: Arial, sans-serif;'>
    <h2 style='color: #2a4365;'>Vaccination Result Notification</h2>
    <p>Dear <strong>{studinfo.Guardian.FullName}</strong>,</p>
    <p>This is to inform you that your child <strong>{studinfo.FullName}</strong> 
       from class <strong>{studinfo.Class.ClassName}</strong> has been vaccinated.</p>
    <p><strong>Vaccination Date:</strong> {result.VaccinatedDate:dd/MM/yyyy}</p>
    <p><strong>Observation Status:</strong> {result.ObservationStatus}</p>
    <p><strong>Vaccinated By:</strong> {result.VaccinatedBy}</p>
    <p>Thank you,<br/>School Health Services</p>
</body>
</html>";
        }
        else
        {
            subject = $"[Vaccination Notice] {studinfo.FullName} was not vaccinated";
            body = $@"
<html>
<body style='font-family: Arial, sans-serif;'>
    <h2 style='color: #c53030;'>Vaccination Could Not Proceed</h2>
    <p>Dear <strong>{studinfo.Guardian.FullName}</strong>,</p>
    <p>We regret to inform you that your child <strong>{studinfo.FullName}</strong> 
       from class <strong>{studinfo.Class.ClassName}</strong> could not be vaccinated.</p>
    <p><strong>Reason:</strong> {result.ObservationStatus}</p>
    <p><strong>Recorded By:</strong> {result.VaccinatedBy}</p>
    <p>Please contact the school health services for more details if needed.</p>
    <p>Thank you,<br/>School Health Services</p>
</body>
</html>";
        }

        // B4: Gửi email nền (queue hoặc trực tiếp)
        _emailQueue.Enqueue(new EmailMessageDto
        {
            ToList = studinfo.Guardian.Email,
            Subject = subject,
            Body = body,
            IsHtml = true
        });
    }



    public Task<List<VaccinationResultVM>> GetResultsByNotificationAsync(int notificationId, int classId)
        => _repo.GetResultsByNotificationAsync(notificationId, classId);

    public Task<List<VaccinationResultVM>> GetResultsByGuardianAsync(int guardianId)
        => _repo.GetResultsByGuardianAsync(guardianId);
}