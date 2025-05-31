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
    }
}
