using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace DAL.Repositories
{
    public class HealthCheckRepository : IHealthCheckRepository
    {
        private readonly AppDbContext _context;

        public HealthCheckRepository(AppDbContext context)
        {
            _context = context;
        }

        public bool StudentExists(int studentId)
        {
            return _context.Students.Any(s => s.StudentId == studentId);
        }

        public void AddHealthCheck(HealthChecks profile)
        {
            _context.HealthChecks.Add(profile);
            _context.SaveChanges();
        }
        public List<int> GetStudentIdsByGuardian(int guardianId)
        {
            return _context.Students
                .Where(s => s.GuardianId == guardianId)
                .Select(s => s.StudentId)
                .ToList();
        }

        public List<HealthChecks> GetByStudentIds(List<int> studentIds)
        {
            return _context.HealthChecks
                .Where(h => studentIds.Contains(h.StudentId))
                .OrderByDescending(h => h.CheckDate)
                .ToList();
        }

    }
}
