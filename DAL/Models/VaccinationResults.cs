using System.ComponentModel.DataAnnotations;

public class VaccinationResults
{
    [Key]
    public int ResultId { get; set; }
    public int StudentId { get; set; }
    public int NotificationId { get; set; }
    public bool? Vaccinated { get; set; }
    public DateTime? VaccinatedDate { get; set; }
    public string? ObservationStatus { get; set; }
    public string? VaccinatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
}
