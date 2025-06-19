namespace DAL.Models
{
    public class HealthProfileDTO
   {
       public int Id { get; set; }
        public int StudentId { get; set; }
       public string? Allergies { get; set; }
       public string? ChronicDiseases { get; set; }
       public string? Vision { get; set; }
       public string? Hearing { get; set; }
       public string? OtherNotes { get; set; }
    }
}
    