using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Models;
namespace DAL.MedicationIntakeLogs
{
    public interface IMedicationIntakeLogRepo
    {
        Task<IEnumerable<MedicationIntakeLog>> GetLogsByStudentIdAsync(int studentId);
        Task<MedicationIntakeLog> CreateLogAsync(MedicationIntakeLog log);
    }
}
