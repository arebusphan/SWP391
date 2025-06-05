using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DAL.Models
{
    public class ConsultationAppointments
    {
        [Key]
        public int AppointmentId { get; set; }

        [Required]
        public int StudentId { get; set; }

        [Required]
        public DateTime AppointmentDate { get; set; }

        public string Reason { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        [ForeignKey("StudentId")]
        public Students Student { get; set; } = new Students();
    }
}
