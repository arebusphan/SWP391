using DAL.Models;

public class NotificationClass
{
    public int Id { get; set; }
    public int? NotificationId { get; set; }
    public int? ClassId { get; set; }

    public virtual HealthNotification Notification { get; set; }
    public virtual Classes Class { get; set; }
}
