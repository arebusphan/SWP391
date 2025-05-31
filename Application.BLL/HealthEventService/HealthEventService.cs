public class HealthEventService : IHealthEventService
{
    private readonly IHealthEventRepository _repository;

    public HealthEventService(IHealthEventRepository repository)
    {
        _repository = repository;
    }

    public async Task RecordHealthEventAsync(HealthEventDto dto, int recordedBy)
    {
        var entity = new HealthEvent
        {
            StudentId = dto.StudentId,
            EventType = dto.EventType,
            Description = dto.Description,
            Execution = dto.Execution,
            EventDate = DateTime.Now,
            // Set RecordedBy from param
        };

        await _repository.AddHealthEventAsync(entity);
    }

    public async Task<IEnumerable<HealthEventDto>> GetStudentEventsAsync(int studentId)
    {
        var events = await _repository.GetEventsByStudentIdAsync(studentId);
        return events.Select(e => new HealthEventDto
        {
            StudentId = e.StudentId,
            EventType = e.EventType,
            Description = e.Description,
            Execution = e.Execution,
            EventDate = e.EventDate
        });
    }
}
