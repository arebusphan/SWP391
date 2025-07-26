using DAL.Models;

public interface IHealthCheckRepository
{
    Task AddHealthCheckAsync(HealthChecks profile);
    bool StudentExists(int studentId);
    List<int> GetStudentIdsByGuardian(int guardianId);
    List<HealthChecks> GetByStudentIds(List<int> studentIds);

}
