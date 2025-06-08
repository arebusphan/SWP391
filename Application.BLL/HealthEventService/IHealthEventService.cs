public interface IHealthEventService
{
    //Task RecordHealthEventAsync(HealthEventDto dto, int recordedBy);
    //Task<IEnumerable<HealthEventDto>> GetStudentEventsAsync(int studentId);
    Task RecordHealthEventAsync(HealthEventDto dto);
    Task<IEnumerable<HealthEventDto>> GetStudentEventsAsync(int studentId);
    Task<IEnumerable<HealthEventDto>> GetAllEventsAsync();
    Task DeleteHealthEventAsync(int eventId);
    Task UpdateHealthEventAsync(HealthEventDto dto);
}
