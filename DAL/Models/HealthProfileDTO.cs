namespace DAL.Models
{
    public class HealthProfileDTO
   {

       public int DeclarationId { get; set; }
       public int StudentId { get; set; }

       public string? Allergies { get; set; }
       public string? ChronicDiseases { get; set; }
       public string? Vision { get; set; }
       public string? Hearing { get; set; }
       public string? OtherNotes { get; set; }

       public string? StudentName { get; set; } // optional: phục vụ hiển thị
       public string? ClassName { get; set; }   // optional: phục vụ lọc lớp
    }
}
    