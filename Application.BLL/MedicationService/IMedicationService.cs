using DAL.Models;

namespace BLL.MedicationService
{
    public interface IMedicationService
    {
        void CreateRequest(MedicationRequestDTO dto, int parentUserId);
        List<MedicationRequestResponseDTO> GetRequestsByParent(int parentUserId);
    }
}
