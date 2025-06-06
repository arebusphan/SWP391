using DAL.Models;

namespace BLL.MedicationService
{
    public interface IMedicationService
    {
        void CreateRequest(MedicationRequestDTO dto, int parentUserId);
        List<MedicationRequestResponseDTO> GetRequestsByParent(int parentUserId);
        List<MedicationRequestResponseDTO> GetPendingRequests();
        bool UpdateRequestStatus(int requestId, string newStatus, int reviewedBy);
    }
}
