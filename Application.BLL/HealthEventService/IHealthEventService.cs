public interface IHealthEventService
{
    Task RecordHealthEventAsync(HealthEventDto dto, int recordedBy);
    Task<IEnumerable<HealthEventDto>> GetStudentEventsAsync(int studentId);
}
