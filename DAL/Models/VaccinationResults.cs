using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DAL.Models; // Đảm bảo import nếu chưa có

public class VaccinationResults
{
    [Key]
    public int ResultId { get; set; }

    public int StudentId { get; set; }

    [ForeignKey("StudentId")]
    public Students Student { get; set; } = null!;

    public int NotificationId { get; set; }
    public bool? Vaccinated { get; set; }
    public DateTime? VaccinatedDate { get; set; }
    public string? ObservationStatus { get; set; }
    public string? VaccinatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
}
