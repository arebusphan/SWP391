using System.ComponentModel.DataAnnotations;

namespace DAL.Models
{
    public class Vaccine
    {
        [Key]
        public int VaccineId { get; set; }
        public string VaccineName { get; set; } = string.Empty;

        // ✅ Navigation property để EF hiểu mối quan hệ
        public ICollection<VaccinationRecord> VaccinationRecords { get; set; } = new List<VaccinationRecord>();
    }
}
