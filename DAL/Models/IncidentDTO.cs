using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class IncidentDTO
    {
        public int StudentId { get; set; }
        public int ClassId { get; set; }
        public string IncidentName { get; set; }
        public string? Description { get; set; }
        public string? HandledBy { get; set; }
        public DateTime OccurredAt { get; set; }
        public DateTime CreatedAt { get;set; }
    }

}
