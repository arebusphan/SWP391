namespace DAL.Models
{
    public class HealthNotificationDTO
    {
        public string EventName { get; set; }
        public string EventType { get; set; } // "vaccine" hoặc "healthcheck"
        public DateTime EventDate { get; set; }
        public string? CreatedBy { get; set; }
        public List<int> ClassIds { get; set; }
    }
}