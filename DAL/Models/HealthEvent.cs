using DAL.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class HealthEvent
{
    [Key]
    public int EventId { get; set; }
    public int StudentId { get; set; }
    public string EventType { get; set; }
    public string Description { get; set; }
    public string Execution { get; set; }
    public DateTime EventDate { get; set; }
    

    // Mapping chính xác với cột RecordedBy
    
   

    public Students Student { get; set; }
    public ICollection<HealthEventSupply> Supplies { get; set; }
}
