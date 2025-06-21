using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DAL.Models
{
    public class MedicationRequests
    {
        [Key]
        public int RequestId { get; set; }

        public int StudentId { get; set; }
        [ForeignKey("StudentId")]
        public Students Student { get; set; }

        [Required]
        public string MedicineName { get; set; }

        public string PrescriptionImage { get; set; }

        public string HealthStatus { get; set; }  // ✅ Tình trạng sức khỏe

        public string Note { get; set; }          // ✅ Ghi chú thêm

        public string Status { get; set; } = "Pending";

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public string? RejectReason { get; set; }
        public int CreatedBy { get; set; }
        [ForeignKey("CreatedBy")]
        public Users CreatedByUser { get; set; }

        public int? ReviewedBy { get; set; }
        [ForeignKey("ReviewedBy")]
        public Users ReviewedByUser { get; set; }
    }
}
