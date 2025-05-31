using DAL.Models;

namespace DAL.Repositories
{
    public interface IHealthCheckRepository
    {
        void AddHealthCheck(HealthChecks profile);
        bool StudentExists(int studentId);
    }
}
