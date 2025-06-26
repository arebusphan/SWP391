using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class MedicalIncidents
    {
        [Key]
        public int? IncidentId { get; set; }
        public int? StudentId { get; set; }
        public int? ClassId { get; set; }
        public string? IncidentName { get; set; }
        public string? Description { get; set; }
        public string? HandledBy { get; set; }
        public DateTime? OccurredAt { get; set; }
        public DateTime? CreatedAt { get; set; }
        public ICollection<IncidentSupplies> IncidentSupplies { get; set; }
        public Students Student { get; set; }
        public Classes Class { get; set; }

    }
}
