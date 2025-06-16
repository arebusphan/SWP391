namespace DAL.Models
{
    public class HealthNotificationDTO
    {
        public string EventName { get; set; }
        public string EventType { get; set; } // "vaccine" hoặc "healthcheck"
        public DateTime EventDate { get; set; }
        public string? CreatedBy { get; set; }
        public List<int> ClassIds { get; set; }

        // ✅ Đây là URL từ Cloudinary, không còn là base64 nữa
        public string? EventImage { get; set; } // ví dụ: https://res.cloudinary.com/abc/image/upload/...
    }
}
