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
        public async Task<MedicalIncidents> AddAsync(IncidentDTO incident)
        {
            var entity = new MedicalIncidents
            {
                ClassId = incident.ClassId,
                CreatedAt = DateTime.UtcNow,
                Description = incident.Description,
                HandledBy = incident.HandledBy,
                IncidentName = incident.IncidentName,
                OccurredAt = null,
                StudentId = incident.StudentId,
            };
           await _context.MedicalIncidents.AddAsync(entity);
                await _context.SaveChangesAsync();
            return entity;
        }

    }
}
