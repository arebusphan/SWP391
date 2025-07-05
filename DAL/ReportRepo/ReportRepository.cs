using DAL.Models.ReportDTO;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.ReportRepo
{
    public class ReportRepository : IReportRepository
    {
        private readonly AppDbContext _context;

        public ReportRepository(AppDbContext context)
        {
            _context = context;
        }

        // 1. Medication status by class
        public List<MedicationGroupDto> GetMedicationStatusByClass()
        {
            return _context.MedicationRequests
                .Include(r => r.Student)
                    .ThenInclude(s => s.Class)
                .Where(r => r.Student != null && r.Student.Class != null)
                .GroupBy(r => new { r.Student.Class.ClassName, r.Status })
                .Select(g => new MedicationGroupDto
                {
                    ClassName = g.Key.ClassName,
                    Status = g.Key.Status,
                    Count = g.Count()
                })
                .ToList();
        }

        // 2. Vaccine consent (Đồng ý/Không đồng ý/Chưa xác nhận)
        public List<VaccineConsentGroupDto> GetVaccineConsentByClass()
        {
            return _context.NotificationStudents
                .Include(n => n.Student)
                    .ThenInclude(s => s.Class)
                .Where(n => n.Student != null && n.Student.Class != null)
                .GroupBy(n => new { n.Student.Class.ClassName, n.ConfirmStatus })
                .Select(g => new VaccineConsentGroupDto
                {
                    ClassName = g.Key.ClassName,
                    ConfirmStatus = g.Key.ConfirmStatus ?? "Chưa xác nhận",
                    Count = g.Count()
                })
                .ToList();
        }

        // 3. Vaccine status (Đã tiêm/Chưa tiêm)
        public List<VaccineStatusGroupDto> GetVaccineStatusByClass()
        {
            return _context.VaccinationResults
                .Include(v => v.Student)
                    .ThenInclude(s => s.Class)
                .Where(v => v.Student != null && v.Student.Class != null)
                .GroupBy(v => new
                {
                    v.Student.Class.ClassName,
                    Status = v.Vaccinated == true ? "Đã tiêm" : "Chưa tiêm"
                })
                .Select(g => new VaccineStatusGroupDto
                {
                    ClassName = g.Key.ClassName,
                    Status = g.Key.Status,
                    Count = g.Count()
                })
                .ToList();
        }

        // 4. Health check result summary
        public List<HealthCheckGroupDto> GetHealthCheckSummaryByClass()
        {
            return _context.HealthChecks
                .Include(h => h.Student)
                    .ThenInclude(s => s.Class)
                .Where(h => h.Student != null && h.Student.Class != null)
                .GroupBy(h => new { h.Student.Class.ClassName })
                .Select(g => new HealthCheckGroupDto
                {
                    ClassName = g.Key.ClassName,
                    ResultCategory = "Bình thường", // có thể thay đổi logic phân loại
                    Count = g.Count()
                })
                .ToList();
        }

        // 5. Medical incidents by type
        public List<IncidentGroupDto> GetMedicalIncidentsByClass()
        {
            return _context.MedicalIncidents
                .Include(i => i.Class)
                .Where(i => i.Class != null)
                .GroupBy(i => new { i.Class.ClassName, i.IncidentName })
                .Select(g => new IncidentGroupDto
                {
                    ClassName = g.Key.ClassName,
                    IncidentType = g.Key.IncidentName,
                    Count = g.Count()
                })
                .ToList();
        }
    }
}
