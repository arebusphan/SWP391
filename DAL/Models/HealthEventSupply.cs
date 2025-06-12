using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

public class HealthEventSupply
{
    [Key]
    public int EventSupplyId { get; set; }

    [Column("EventId")]
    public int EventId { get; set; }

    public int SupplyId { get; set; }
    public int QuantityUsed { get; set; }

    [ForeignKey("EventId")]
    public virtual HealthEvent HealthEvent { get; set; }

    [ForeignKey(nameof(SupplyId))]
    public MedicalSupply Supply { get; set; }

}
