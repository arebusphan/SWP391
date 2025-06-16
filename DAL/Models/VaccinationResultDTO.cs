public class VaccinationResultDTO
{
    public int StudentId { get; set; }
    public int NotificationId { get; set; }
    public bool Vaccinated { get; set; }
    public DateTime VaccinatedDate { get; set; }
    public string? ObservationStatus { get; set; }
    public string? VaccinatedBy { get; set; }
}
