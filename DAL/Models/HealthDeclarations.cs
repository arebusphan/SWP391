using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class HealthDeclarations
    {
        [Key]
        public int DeclarationId { get; set; }

        [ForeignKey("Students")]
        public int StudentId { get; set; }

        [MaxLength(255)]
        public string? Allergies { get; set; }

        [MaxLength(255)]
        public string? ChronicDiseases { get; set; }

        [MaxLength(100)]
        public string? Vision { get; set; }

        [MaxLength(100)]
        public string? Hearing { get; set; }

        [MaxLength(255)]
        public string? OtherNotes { get; set; }

        [ForeignKey("CreatedByUser")]
        public int CreatedBy { get; set; }

        [ForeignKey("ReviewedByUser")]
        public int? ReviewedBy { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public Students Students { get; set; }
        public Users CreatedByUser { get; set; }
        public Users? ReviewedByUser { get; set; }
    }
}
