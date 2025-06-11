using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DAL.Models
{
    public class HealthProfile
    {
        [Key, ForeignKey("Student")] // Dùng chính StudentId làm khóa chính & khóa ngoại
        public int StudentId { get; set; }

        public float? LeftEyeVision { get; set; }
        public float? RightEyeVision { get; set; }

        public string? LeftEarHearing { get; set; }
        public string? RightEarHearing { get; set; }

        public string? SpineStatus { get; set; }
        public string? SkinStatus { get; set; }
        public string? OralHealth { get; set; }
        public string? OtherNotes { get; set; }
        public string? Allergies { get; set; }
        public string? ChronicDiseases { get; set; }
        public string? Vision { get; set; }
        public string? Hearing { get; set; }


        // ✅ Navigation back to Student
        public virtual Students Student { get; set; }
    }
}
