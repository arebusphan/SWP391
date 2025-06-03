using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DAL.Models
{
    public class NotificationStudents
    {
        [Key]
        public int NotificationStudentId { get; set; }

        public int NotificationId { get; set; }
        public int StudentId { get; set; }

        public bool? ParentConfirmed { get; set; }
        public DateTime? ConfirmedAt { get; set; }

        [ForeignKey("NotificationId")]
        public HealthNotifications Notification { get; set; }

        [ForeignKey("StudentId")]
        public Students Student { get; set; }
    }
}
