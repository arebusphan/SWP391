using DAL.Models;

public interface IHealthCheckRepository
{
    void AddHealthCheck(HealthChecks check);
    bool StudentExists(int studentId);
}
