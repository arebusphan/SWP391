using System.ComponentModel.DataAnnotations;

public class HealthNotification
{
    [Key]
    public int NotificationId { get; set; }
    public string EventName { get; set; }
    public string EventType { get; set; } // "Vaccination" hoặc "HealthCheck"
    public string? EventImage { get; set; } // 🟡 Là chuỗi đường dẫn ảnh
    public DateTime EventDate { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }

    public ICollection<NotificationClass> NotificationClasses { get; set; }
}
