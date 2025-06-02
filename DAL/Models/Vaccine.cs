using System.ComponentModel.DataAnnotations;

namespace DAL.Models
{
    public class Vaccine
    {
        [Key]
        public int VaccineId { get; set; }
        public string VaccineName { get; set; }

        // Navigation property (optional)
        public ICollection<VaccinationRecord> VaccinationRecords { get; set; }
    }
}
