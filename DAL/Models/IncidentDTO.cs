using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace DAL.Models
{
    public class IncidentDTO
    {
       
        public int? StudentId { get; set; } 
        public int? ClassId { get; set; }
        public string IncidentName { get; set; }
        public string? Description { get; set; }
        public string? HandledBy { get; set; }
        public DateTime? OccurredAt { get; set; }
        public string? StudentName { get; set; }
        public string? ClassName { get; set; }
        public List<SupplyUsedDTO> SuppliesUsed { get; set; }

    }

}
