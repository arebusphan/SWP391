using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class HealthProfileCreateDTO
    {
        public int StudentId { get; set; }
        public string? Allergies { get; set; }
        public string? ChronicDiseases { get; set; }
        public string? Vision { get; set; }
        public string? Hearing { get; set; }
        public string? OtherNotes { get; set; }
    }
}
