using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class UpdateSuppliesDTO
    {

     
        public int SupplyId { get; set; }
       
        public int? Quantity { get; set; }
  
    }
}
