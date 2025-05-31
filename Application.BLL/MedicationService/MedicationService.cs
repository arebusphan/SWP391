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
            CreatedBy = parentUserId,
            Status = "Pending"
        };

        _medicationRepository.Add(request);
    }

    public List<MedicationRequestResponseDTO> GetRequestsByParent(int parentUserId)
    {
        var data = _medicationRepository.GetRequestsByParent(parentUserId);

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
}
