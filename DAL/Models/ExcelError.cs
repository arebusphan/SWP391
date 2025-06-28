using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class ExcelError
    {
        public int RowNumber { get; set; }
        public string FullName { get; set; } = "";
        public string PhoneNumber { get; set; } = "";
        public string Email { get; set; } = "";
        public string Role { get; set; } = "";
        public string? StudentFullName { get; set; }
        public DateTime? StudentDateOfBirth { get; set; }
        public string? StudentGender { get; set; }
        public string? ClassName { get; set; }
        public string Message { get; set; } = "";
    }
}
