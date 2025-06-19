using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class MedicationIntakeLog
    {
        [Key]
        public int LogId { get; set; }

        [Required]
        public int RequestId { get; set; }

        [Required]
        public int StudentId { get; set; }

        public DateTime IntakeTime { get; set; } = DateTime.Now;

        [MaxLength(100)]
        public string? GivenBy { get; set; }

        [MaxLength(255)]
        public string? Notes { get; set; }

        [ForeignKey("RequestId")]
        public virtual MedicationRequests MedicationRequest { get; set; } = null!;

        [ForeignKey("StudentId")]
        public virtual Students Student { get; set; } = null!;
    }
}
