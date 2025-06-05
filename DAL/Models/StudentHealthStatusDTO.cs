using System;

namespace DAL.Models
{
    public class StudentHealthStatusDTO
    {
        public int StudentId { get; set; }
        public string FullName { get; set; }
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }

        public DateTime? LatestVaccinationDate { get; set; }
        public int TotalVaccinations { get; set; }

        public DateTime? LatestHealthCheckDate { get; set; }
        public float? WeightKg { get; set; }
        public float? HeightCm { get; set; }

        public bool HasConsultation { get; set; }
        public DateTime? ConsultationDate { get; set; }
    }
}
