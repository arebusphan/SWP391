﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class MedicalSuppliesDTO
    {
        public int SupplyId { get; set; }
        public string? SupplyName { get; set; }
        public int? Quantity { get; set; }
     
        public string? Notes { get; set; }
        public string? Image { get; set; }

    }
}
