using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace DAL.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        private readonly AppDbContext _context;

        public StudentRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<Students> GetStudentsByGuardian(int guardianId)
        {
            return _context.Students
                .Where(s => s.GuardianId == guardianId)
                .ToList();
        }
    }
}
