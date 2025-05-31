using DAL.Models;

public interface IHealthEventRepository
{
    Task AddHealthEventAsync(HealthEvent healthEvent);
    Task<IEnumerable<HealthEvent>> GetEventsByStudentIdAsync(int studentId);
}

