namespace DTOs
{
    public class VaccinationRecordDto
    {
        public int StudentId { get; set; }
        public int VaccineId { get; set; }
        public DateTime VaccinationDate { get; set; }
        public string Notes { get; set; }
    }
}
