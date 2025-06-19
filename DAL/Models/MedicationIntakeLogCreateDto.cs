using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class MedicationIntakeLogCreateDto
    {
        [Required]
        public int RequestId { get; set; }

        [Required]
        public int StudentId { get; set; }

        [MaxLength(100)]
        public string? GivenBy { get; set; }

        [MaxLength(255)]
        public string? Notes { get; set; }
    }
}
