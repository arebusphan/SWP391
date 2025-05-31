using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace DAL.Repositories
{
    public class MedicationRepository : IMedicationRepository
    {
        private readonly AppDbContext _context;

        public MedicationRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Add(MedicationRequests request)
        {
            _context.MedicationRequests.Add(request);
            _context.SaveChanges();
        }

        public List<MedicationRequests> GetRequestsByParent(int parentId)
        {
            return _context.MedicationRequests
                .Where(r => r.CreatedBy == parentId)
                .Include(r => r.Student)
                .ToList();
        }
    }
}
