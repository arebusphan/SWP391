using DAL.Models;

namespace BLL.HealthCheckService
{
    public interface IHealthCheckService
    {
        void SubmitHealthProfile(int studentId, HealthProfileDTO dto, int recordedBy);
    }
}
