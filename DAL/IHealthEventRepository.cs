using DAL.Models;

public interface IHealthEventRepository
{
    Task AddHealthEventAsync(HealthEvent entity);
    Task<IEnumerable<HealthEvent>> GetEventsByStudentIdAsync(int studentId);
    Task<IEnumerable<HealthEvent>> GetAllEventsAsync();
    Task DeleteHealthEventAsync(int eventId);
    Task UpdateHealthEventAsync(HealthEvent entity);
}

