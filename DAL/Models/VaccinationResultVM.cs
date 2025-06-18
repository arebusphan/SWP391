public class VaccinationResultVM
{
    public int StudentId { get; set; }
    public string StudentName { get; set; } = null!;
    public string ClassName { get; set; } = null!;
    public string? ConfirmStatus { get; set; }
    public bool? Vaccinated { get; set; }
    public DateTime? VaccinatedDate { get; set; }
    public string? ObservationStatus { get; set; }
}
