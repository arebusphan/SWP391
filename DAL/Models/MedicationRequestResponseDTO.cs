namespace DAL.Models
{
    public class MedicationRequestResponseDTO
    {
        public int RequestId { get; set; }
        public int StudentId { get; set; }
        public string StudentName { get; set; }
        public string MedicineName { get; set; }
        public string PrescriptionImage { get; set; }
        public string HealthStatus { get; set; }
        public string Note { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? RejectReason { get; set; }
    }
}
