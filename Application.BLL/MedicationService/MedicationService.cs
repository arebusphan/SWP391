using BLL.EmailService;
using BLL.MedicationService;
using DAL.EmailRepo;
using DAL.Models;
using DAL.Repositories;
using System.Collections.Generic;
using System.Linq;

public class MedicationService : IMedicationService
{
    private readonly IMedicationRepository _medicationRepository;
    private readonly IEmailService _emailService;
    private readonly IStudentRepository _studentRepository;
    private readonly IEmailQueue _emailQueue;
    public MedicationService(IMedicationRepository medicationRepository,IEmailService emailService,IStudentRepository studentRepository, IEmailQueue emailQueue )
    {
        _medicationRepository = medicationRepository;
        _emailService = emailService;
        _studentRepository = studentRepository;
        _emailQueue = emailQueue;
    }

    public void CreateRequest(MedicationRequestDTO dto, int parentUserId)
    {
        var request = new MedicationRequests
        {
            StudentId = dto.StudentId,
            MedicineName = dto.MedicineName,
            PrescriptionImage = dto.PrescriptionImage,
            HealthStatus = dto.HealthStatus, 
            Note = dto.Note,                
            CreatedBy = parentUserId,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        _medicationRepository.Add(request);
    }


    public List<MedicationRequestResponseDTO> GetRequestsByParent(int parentId, string? status = null)
    {
        var query = _medicationRepository.GetAll()
            .Where(r => r.CreatedBy == parentId);

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(r => r.Status == status);
        }

        return query.Select(r => new MedicationRequestResponseDTO
        {
            RequestId = r.RequestId,
            StudentId = r.StudentId,
            StudentName = r.Student?.FullName ?? "(Unknown)",
            MedicineName = r.MedicineName,
            PrescriptionImage = r.PrescriptionImage,
            Status = r.Status,
            CreatedAt = r.CreatedAt,
            HealthStatus = r.HealthStatus ?? "",
            Note = r.Note ?? "",
            RejectReason = r.RejectReason ?? ""
        }).ToList();
    }


    public List<MedicationRequestResponseDTO> GetPendingRequests()
    {
        var data = _medicationRepository.GetPendingRequests();

        return data.Select(r => new MedicationRequestResponseDTO
        {
            RequestId = r.RequestId,
            StudentId = r.StudentId,
            StudentName = r.Student?.FullName ?? "(Unknown)",
            MedicineName = r.MedicineName,
            PrescriptionImage = r.PrescriptionImage,
            HealthStatus = r.HealthStatus,
            Note = r.Note,
            Status = r.Status,
            CreatedAt = r.CreatedAt,

        }).ToList();
    }

    public async Task<bool> UpdateRequestStatus(int requestId, string newStatus, int reviewedBy, string rejectReason)
    {
        var request = _medicationRepository.GetById(requestId);
        if (request == null || string.Equals(request.Status, "Rejected", StringComparison.OrdinalIgnoreCase))
            return false;

        request.Status = newStatus;
        request.ReviewedBy = reviewedBy;

        if (string.Equals(newStatus, "Rejected", StringComparison.OrdinalIgnoreCase))
        {
            request.RejectReason = rejectReason ?? "";
        }

        _medicationRepository.Update(request);
        _medicationRepository.Save();

        // Gửi email cá nhân hóa (fire-and-forget)
        var studinfo = await _studentRepository.GetGuardianEmailByStudentIdAsync(request.StudentId);
        if (!string.IsNullOrWhiteSpace(studinfo.Guardian.Email))
        {
            var subject = "Medication Request Update";
            var body = newStatus switch
            {
                "Rejected" => $"Your medication request has been rejected.<br/><strong>Reason:</strong> {rejectReason ?? "No reason provided."}",
                "Approved" => "Your medication request has been approved.",
                _ => $"The status of your medication request has been updated to: {newStatus}"
            };

            // Đưa vào hàng đợi
            _emailQueue.Enqueue(new EmailMessageDto
            {
                ToList = studinfo.Guardian.Email,              
                Subject = subject,
                Body = body,
                IsHtml = true       
            });
        }

        return true;
    }


    public List<MedicationRequests> GetAll()
    {
        return _medicationRepository.GetAll().ToList();
    }
    public List<MedicationRequestResponseDTO> GetApprovedRequests()
    {
        var data = _medicationRepository.GetApprovedRequests();

        return data.Select(r => new MedicationRequestResponseDTO
        {
            RequestId = r.RequestId,
            StudentId = r.StudentId,
            StudentName = r.Student?.FullName ?? "(Unknown)",
            MedicineName = r.MedicineName,
            PrescriptionImage = r.PrescriptionImage,
            HealthStatus = r.HealthStatus,
            Note = r.Note,
            Status = r.Status,
            CreatedAt = r.CreatedAt
        }).ToList();
    }

    public async Task<List<MedicationRequestResponseDTO>> GetRejectedOrAdministeredAsync()
    {
        return await _medicationRepository.GetRejectedOrAdministeredAsync();
    }
}
