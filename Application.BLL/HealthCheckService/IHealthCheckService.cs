using DTOs;

namespace BLL.HealthCheckService
{
    public interface IHealthCheckService
    {
        Task SubmitHealthCheckAsync(HealthCheckDto dto);
        List<HealthCheckDto> GetHealthChecksByGuardian(int guardianId);

    }
}
