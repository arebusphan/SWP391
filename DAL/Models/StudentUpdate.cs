using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class UpdateStudent
    {
        public string FullName { get; set; } = string.Empty;
        public string DateOfBirth { get; set; } = string.Empty; 
        public string Gender { get; set; } = string.Empty;
        public int ClassId { get; set; }
    }
}
