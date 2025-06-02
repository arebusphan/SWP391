using System.ComponentModel.DataAnnotations;

public class MedicalSupply
{
    [Key]
    public int SupplyId { get; set; }
    public string SupplyName { get; set; }
    public string Description { get; set; }
}
