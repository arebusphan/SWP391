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
        public List<MedicationRequests> GetPendingRequests()
        {
            return _context.MedicationRequests
                .Where(r => r.Status == "Pending")
                .Include(r => r.Student)
                .Include(r => r.CreatedByUser)
                .ToList();
        }

        public MedicationRequests GetById(int requestId)
        {
            return _context.MedicationRequests
                .FirstOrDefault(r => r.RequestId == requestId);
        }

        public void Update(MedicationRequests request)
        {
            _context.MedicationRequests.Update(request);
            _context.SaveChanges();
        }
        public void Save()
        {
            _context.SaveChanges(); 
        }
        public List<MedicationRequests> GetAll()
        {
            return _context.MedicationRequests
                .Include(r => r.Student)
                .ThenInclude(s => s.Guardian)
                .ToList();
        }

    }
}
