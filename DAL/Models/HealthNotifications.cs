using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DAL.Models
{
    public class HealthNotifications
    {
        [Key]
        public int NotificationId { get; set; }

        [Required]
        public string NotificationType { get; set; }  // Vaccination | HealthCheck

        [Required]
        public string Title { get; set; }

        public string Content { get; set; }

        public int CreatedBy { get; set; }

        public DateTime CreatedAt { get; set; }

        [ForeignKey("CreatedBy")]
        public Users Creator { get; set; }

        public ICollection<NotificationStudents> NotificationStudents { get; set; }
    }
}
