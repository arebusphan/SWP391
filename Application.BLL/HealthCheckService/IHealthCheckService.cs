using DTOs;

namespace BLL.HealthCheckService
{
    public interface IHealthCheckService
    {
        void SubmitHealthCheck(HealthCheckDto dto);
    }
}
