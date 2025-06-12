using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DAL.Models;

public class HealthEvent
{
    [Key]
    public int EventId { get; set; }

    public int StudentId { get; set; }
    public string EventType { get; set; }
    public string Description { get; set; }
    public string Execution { get; set; }

    // Cột mới
    public int SupplyId { get; set; }
    public int QuantityUsed { get; set; }

    public DateTime EventDate { get; set; } = DateTime.Now;  // Default GETDATE()

    // Mapping quan hệ với bảng Students
    public Students Student { get; set; }

    // Mapping quan hệ với bảng MedicalSupplies
    public MedicalSupply Supply { get; set; }

    // Mapping với collection Supplies nếu cần thiết (nếu một sự kiện có nhiều vật tư y tế)
    public ICollection<HealthEventSupply> Supplies { get; set; }
}