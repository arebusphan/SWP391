using DAL.Models;

public interface IHealthCheckRepository
{
    void AddHealthCheck(HealthChecks check);
    bool StudentExists(int studentId);
    List<int> GetStudentIdsByGuardian(int guardianId);
    List<HealthChecks> GetByStudentIds(List<int> studentIds);

}
