using DAL.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Reflection.PortableExecutable;

public class VaccinationRecord
{
    [Key]
    public int RecordId { get; set; }

    public int StudentId { get; set; }
    public int VaccineId { get; set; }
    public DateTime VaccinationDate { get; set; }
    public string Notes { get; set; }

    [ForeignKey("StudentId")]
    public Students Student { get; set; }

    [ForeignKey("VaccineId")]
    public Vaccine Vaccine { get; set; }
}
