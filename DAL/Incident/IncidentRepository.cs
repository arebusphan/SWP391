using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Models;

namespace DAL.Incident
{
    public class IncidentRepository : IIncidentRepository
    {
        private readonly AppDbContext _context;

        public IncidentRepository(AppDbContext context) {
        _context = context;
        }
        public async Task<MedicalIncident> AddAsync(IncidentDTO incident)
        {
            var entity = new MedicalIncident
            {
                ClassId = incident.ClassId,
                CreatedAt = DateTime.UtcNow,
                Description = incident.Description,
                HandleBy = incident.HandledBy,
                IncidentName = incident.IncidentName,
                OccurredAt = DateTime.UtcNow,
                StudentId = incident.StudentId,
            };
           await _context.medicalIncident.AddAsync(entity);
                await _context.SaveChangesAsync();
            return entity;
        }

    }
}
