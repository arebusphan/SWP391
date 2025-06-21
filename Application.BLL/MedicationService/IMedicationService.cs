using DAL.Models;
using System.Collections.Generic;

namespace BLL.MedicationService
{
    public interface IMedicationService
    {
        void CreateRequest(MedicationRequestDTO dto, int parentUserId);

        // ✅ Cho phép lọc theo status (null = lấy tất cả)
        List<MedicationRequestResponseDTO> GetRequestsByParent(int parentUserId, string? status = null);

        List<MedicationRequestResponseDTO> GetPendingRequests();

        bool UpdateRequestStatus(int requestId, string newStatus, int reviewedBy,string rejectReason);

        // ✅ Nếu bạn cần admin lấy tất cả request
        List<MedicationRequests> GetAll();
    }
}
