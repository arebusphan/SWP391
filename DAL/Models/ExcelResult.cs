using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class ExcelResult
    {
        public int TotalRows { get; set; }
        public int SuccessCount { get; set; }

        // 👇 Đường dẫn tới file lỗi (nếu có)
        public string? ErrorFileUrl { get; set; }
    }
}
