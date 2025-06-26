using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class IncidentSupplies
    {
        [Key]
        public int Id { get; set; }

        public int IncidentId { get; set; }

        [JsonIgnore]
        public MedicalIncidents Incident { get; set; }  

        public int SupplyId { get; set; }

        public MedicalSupplies Supply { get; set; }

        public int QuantityUsed { get; set; }
    }

}
