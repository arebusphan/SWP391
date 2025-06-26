using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class ImportExcelDTO
    {
        public string FullName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;

        // --- Thông tin học sinh (chỉ áp dụng nếu Role là "Parent") ---
        public string? StudentFullName { get; set; }
        public DateTime? StudentDateOfBirth { get; set; }
        public string? StudentGender { get; set; }
        public string? ClassName { get; set; }

        // --- Dòng số trong Excel (để báo lỗi) ---
        public int ExcelRowNumber { get; set; }
    }
}
