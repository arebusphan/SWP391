using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.HealthProfile
{
    public interface IHealthProfileService
    {
        Task SubmitAsync(HealthProfileDTO dto, int createdBy);
        Task<List<HealthProfileDTO>> GetPendingProfilesAsync();
        Task<HealthProfileDTO?> GetByStudentIdAsync(int studentId);
        Task<List<HealthProfileDTO>> GetProfilesByUserAsync(int userId);  // Lấy danh sách đã submit bởi phụ huynh
        Task UpdateAsync(int declarationId, HealthProfileDTO dto, int userId); // Cập nhật hồ sơ đã gửi

    }
}
