public class CreateNotificationDTO
{
    public string EventName { get; set; }
    public string EventType { get; set; }
    public string? EventImage { get; set; }
    public DateTime EventDate { get; set; }
    public string CreatedBy { get; set; }
    public List<int> ClassIds { get; set; }
}
