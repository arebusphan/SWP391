using DAL.Models.StatisticDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.StatisticRepo
{
    public class StatisticRepository : IStatisticRepository
    {
        private readonly AppDbContext _context;

        public StatisticRepository(AppDbContext context)
        {
            _context = context;
        }

        public OverviewStatisticDto GetOverviewStatistics()
        {
            var totalStudents = _context.Students.Count();
            var totalClasses = _context.Classes.Count();
            var totalHealthChecks = _context.HealthChecks.Count();
            var pendingMedRequests = _context.MedicationRequests.Count(r => r.Status == "Pending");
            var vaccinated = _context.VaccinationResults.Count(r => r.Vaccinated == true);
            var unvaccinated = _context.VaccinationResults.Count(r => r.Vaccinated == false);

            var barData = _context.Classes
                .Select(c => new BarItemDto
                {
                    Name = c.ClassName,
                    Students = _context.Students.Count(s => s.ClassId == c.ClassId)
                }).ToList();

            var medicationPie = _context.MedicationRequests
                .GroupBy(r => r.Status)
                .Select(g => new PieItemDto
                {
                    Name = g.Key,
                    Value = g.Count()
                }).ToList();

            var vaccinePie = new List<PieItemDto>
            {
                new PieItemDto { Name = "Vaccinated", Value = vaccinated },
                new PieItemDto { Name = "Unvaccinated", Value = unvaccinated }
            };

            return new OverviewStatisticDto
            {
                StatCards = new List<StatCardDto>
                {
                    new("Total Students", totalStudents),
                    new("Total Classes", totalClasses),
                    new("Pending Medication Requests", pendingMedRequests),
                    new("Health Check Visits", totalHealthChecks),
                    new("Vaccinated Students", vaccinated),
                    new("Unvaccinated Students", unvaccinated),
                },
                BarData = barData,
                MedicationPie = medicationPie,
                VaccinePie = vaccinePie
            };
        }
    }
}
