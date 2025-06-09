using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DAL.Models
{
    public class Students
    {
        [Key]
        public int StudentId { get; set; }

        public string FullName { get; set; } = string.Empty;

        public DateTime DateOfBirth { get; set; }

        public string Gender { get; set; } = string.Empty;

        public int GuardianId { get; set; }

        public Users Guardian { get; set; }

        public ICollection<VaccinationRecord> VaccinationRecords { get; set; } = new List<VaccinationRecord>();

        public ICollection<HealthChecks> HealthChecks { get; set; } = new List<HealthChecks>();

        public ICollection<ConsultationAppointments> ConsultationAppointments { get; set; } = new List<ConsultationAppointments>();
    }
}
