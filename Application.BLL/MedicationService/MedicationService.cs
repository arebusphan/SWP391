using BLL.MedicationService;
using DAL.Models;
using DAL.Repositories;
using System.Collections.Generic;
using System.Linq;

public class MedicationService : IMedicationService
{
    private readonly IMedicationRepository _medicationRepository;

    public MedicationService(IMedicationRepository medicationRepository)
    {
        _medicationRepository = medicationRepository;
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
            CreatedAt = DateTime.Now
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
            CreatedAt = r.CreatedAt
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
            Status = r.Status,
            CreatedAt = r.CreatedAt
        }).ToList();
    }

    public bool UpdateRequestStatus(int requestId, string newStatus, int reviewedBy)
    {
        var request = _medicationRepository.GetById(requestId);
        if (request == null || request.Status != "Pending") return false;

        request.Status = newStatus;
        request.ReviewedBy = reviewedBy;

        _medicationRepository.Update(request);
        _medicationRepository.Save();

        return true;
    }

    public List<MedicationRequests> GetAll()
    {
        return _medicationRepository.GetAll().ToList();
    }
}
