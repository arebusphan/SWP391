﻿namespace DAL.Models
{
    public class MedicationRequestDTO
    {
        public int StudentId { get; set; }

        public string MedicineName { get; set; }

        public string PrescriptionImage { get; set; }

        public string HealthStatus { get; set; } 

        public string Note { get; set; }         
    }
}
