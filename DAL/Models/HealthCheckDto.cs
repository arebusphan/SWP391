namespace DTOs
{
    public class HealthCheckDto
    {
        public int StudentId { get; set; }
        public string StudentName { get; set; } = string.Empty;
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

        // ➕ Thêm để lọc đúng lớp
        public int ClassId { get; set; }
        public string ClassName { get; set; } = string.Empty;
    }

}