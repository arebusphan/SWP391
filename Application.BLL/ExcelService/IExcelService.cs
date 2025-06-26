using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.ExcelService
{
    public interface IExcelService
    {
        Task<ExcelResult> ProcessExcelAsync(Stream fileStream);
    }
}
