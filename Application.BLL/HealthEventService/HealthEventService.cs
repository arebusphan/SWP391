public class HealthEventService : IHealthEventService
{
    private readonly IHealthEventRepository _repository;

    public HealthEventService(IHealthEventRepository repository)
    {
        _repository = repository;
    }

    public async Task RecordHealthEventAsync(HealthEventDto dto)
    {
        var entity = new HealthEvent
        {
            StudentId = dto.StudentId,
            EventType = dto.EventType,
            Description = dto.Description,
            Execution = dto.Execution,
            EventDate = DateTime.Now,
            // Set RecordedBy from param
            // Set thêm SupplyId và QuantityUsed
            SupplyId = dto.SupplyId,
            QuantityUsed = dto.QuantityUsed
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
            EventDate = e.EventDate,
            // Lấy thêm SupplyId và QuantityUsed
            SupplyId = e.SupplyId,
            QuantityUsed = e.QuantityUsed
        });
    }

    public async Task<IEnumerable<HealthEventDto>> GetAllEventsAsync()
    {
        var events = await _repository.GetAllEventsAsync();
        return events.Select(e => new HealthEventDto
        {
            EventId = e.EventId,
            StudentId = e.StudentId,
            EventType = e.EventType,
            Description = e.Description,
            Execution = e.Execution,
            EventDate = e.EventDate,
            // Lấy thêm SupplyId và QuantityUsed
            SupplyId = e.SupplyId,
            QuantityUsed = e.QuantityUsed,
        });
    }

    public async Task DeleteHealthEventAsync(int eventId)
    {
        await _repository.DeleteHealthEventAsync(eventId);
    }

    public async Task UpdateHealthEventAsync(HealthEventDto dto)
    {
        var entity = new HealthEvent
        {
            EventId = dto.EventId,
            StudentId = dto.StudentId,
            EventType = dto.EventType,
            Description = dto.Description,
            Execution = dto.Execution,
            EventDate = dto.EventDate,
            // Cập nhật SupplyId và QuantityUsed
            SupplyId = dto.SupplyId,
            QuantityUsed = dto.QuantityUsed
        };

        await _repository.UpdateHealthEventAsync(entity);
    }
}
