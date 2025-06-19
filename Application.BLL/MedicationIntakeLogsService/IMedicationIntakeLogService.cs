using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.MedicationIntakeLogsService
{
    public interface IMedicationIntakeLogService
    {
        Task<IEnumerable<MedicationIntakeLogDto>> GetLogsByStudentIdAsync(int studentId);
        Task<MedicationIntakeLogDto> CreateLogAsync(MedicationIntakeLogCreateDto dto);
    }
}
