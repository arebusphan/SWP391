using DAL.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


    public class VaccinationRecord
    {
        [Key]
        public int RecordId { get; set; }

        public int StudentId { get; set; }
        public int VaccineId { get; set; }
        public DateTime VaccinationDate { get; set; }
        public string Notes { get; set; } = string.Empty;

        [ForeignKey("StudentId")]
        public Students Student { get; set; } = null!;

        [ForeignKey("VaccineId")]
        public Vaccine Vaccine { get; set; } = null!; // ✅ Để lấy VaccineName qua navigation
    }

