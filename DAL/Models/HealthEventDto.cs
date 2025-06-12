public class HealthEventDto
{
    public int EventId { get; set; }
    public int StudentId { get; set; }
    public string EventType { get; set; }
    public string Description { get; set; }
    public string Execution { get; set; }
    public DateTime EventDate { get; set; }

    // Thêm thông tin vật tư y tế
    public int SupplyId { get; set; }
    public int QuantityUsed { get; set; }
    //public string SupplyName { get; set; }  // Thêm SupplyName
}