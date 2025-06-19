using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class HealthDeclarationDTO
    {
        public int DeclarationId { get; set; }
        public int StudentId { get; set; }

        public string? Allergies { get; set; }
        public string? ChronicDiseases { get; set; }
        public string? Vision { get; set; }
        public string? Hearing { get; set; }
        public string? OtherNotes { get; set; }

        public string? Status { get; set; } // Pending, Approved, Rejected

        public string? StudentName { get; set; } // optional: phục vụ hiển thị
        public string? ClassName { get; set; }   // optional: phục vụ lọc lớp
    }
}
