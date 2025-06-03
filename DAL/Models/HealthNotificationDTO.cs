using System;

namespace DAL.Models
{
    public class HealthNotificationDTO
    {
        public int NotificationId { get; set; }
        public string NotificationType { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool? ParentConfirmed { get; set; }
        public DateTime? ConfirmedAt { get; set; }
        public int StudentId { get; set; }
        public string StudentName { get; set; }
    }
}
