using DAL.Models;
using System.Collections.Generic;

namespace DAL.Repositories
{
    public interface IMedicationRepository
    {
        void Add(MedicationRequests request);
        List<MedicationRequests> GetRequestsByParent(int parentId);
        List<MedicationRequests> GetPendingRequests();
        MedicationRequests GetById(int requestId);
        void Update(MedicationRequests request);
        void Save();
        List<MedicationRequests> GetAll();
        List<MedicationRequests> GetApprovedRequests();
        Task<List<MedicationRequestResponseDTO>> GetRejectedOrAdministeredAsync();
    }
}
