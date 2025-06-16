using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        [ForeignKey("GuardianId")]
        public Users Guardian { get; set; } = null!;

        public int ClassId { get; set; }

        [ForeignKey("ClassId")]
        public Classes Class { get; set; } = null!;

        public virtual HealthProfile? HealthProfile { get; set; }

        public ICollection<HealthChecks> HealthChecks { get; set; } = new List<HealthChecks>();

        public ICollection<ConsultationAppointments> ConsultationAppointments { get; set; } = new List<ConsultationAppointments>();
    }
}
