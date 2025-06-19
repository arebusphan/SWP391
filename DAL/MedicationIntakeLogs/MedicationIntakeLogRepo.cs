using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace DAL.MedicationIntakeLogs
{
    public class MedicationIntakeLogRepo : IMedicationIntakeLogRepo
    {
        private readonly AppDbContext _context;

        public MedicationIntakeLogRepo(AppDbContext context)
        {
            _context = context;
        }

        // Lấy tất cả log theo StudentId
        public async Task<IEnumerable<MedicationIntakeLog>> GetLogsByStudentIdAsync(int studentId)
        {
            return await _context.MedicationIntakeLogs
                .Where(log => log.StudentId == studentId)
                .Include(log => log.MedicationRequest) // Optional
                .OrderByDescending(log => log.IntakeTime)
                .ToListAsync();
        }

        // Tạo log mới
        public async Task<MedicationIntakeLog> CreateLogAsync(MedicationIntakeLog log)
        {
            _context.MedicationIntakeLogs.Add(log);
            await _context.SaveChangesAsync();
            return log;
        }
    }

}
