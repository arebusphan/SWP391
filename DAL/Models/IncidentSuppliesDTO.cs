using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class IncidentSuppliesDTO
    {
        public int? IncidentId { get; set; }
        public string? ClassName { get; set; }
        public string? StudentName { get; set; }
        public string? IncidentName { get; set; }
        public string? Description { get; set; }
        public string? HandledBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public List<MedicalSuppliesDTO> SuppliesUsed { get; set; }
        }
        
}
