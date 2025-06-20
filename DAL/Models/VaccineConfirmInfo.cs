using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class VaccineConfirmInfo
    {
        public int NotificationStudentId { get; set; }   // Id của bảng NotificationStudents

        public int NotificationId { get; set; }          // HealthNotifications.NotificationId
        public string EventName { get; set; }
        public string EventType { get; set; }
        public string EventImage { get; set; }
        public DateTime EventDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; }

        public int StudentId { get; set; }
        public string StudentName { get; set; }
        public string ClassName { get; set; }
    }
}
