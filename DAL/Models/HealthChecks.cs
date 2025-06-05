using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DAL.Models
{
    public class HealthChecks
    {
        [Key]
        public int CheckId { get; set; }

        public int StudentId { get; set; }

        [ForeignKey("StudentId")]
        public Students? Student { get; set; }

        public DateTime CheckDate { get; set; }

        public double? WeightKg { get; set; }
        public double? HeightCm { get; set; }
        public double? LeftEyeVision { get; set; }
        public double? RightEyeVision { get; set; }

        public string? LeftEarHearing { get; set; }
        public string? RightEarHearing { get; set; }
        public string? SpineStatus { get; set; }
        public string? SkinStatus { get; set; }
        public string? OralHealth { get; set; }
        public string? OtherNotes { get; set; }

        public int RecordedBy { get; set; }

        [ForeignKey("RecordedBy")]
        public Users? Recorder { get; set; }
    }
}
