using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Banners
    {
        [Key]
        public int id { get; set; }
        public string? title { get; set; }
        public string imageUrl { get; set; }
    }
}
