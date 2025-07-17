using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Models;
using Microsoft.EntityFrameworkCore;
namespace DAL.Incident
{
    public class IncidentRepository : IIncidentRepository
    {
        private readonly AppDbContext _context;

        public IncidentRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IncidentDTO> AddAsync(IncidentDTO incidentDto)
        {
            var incident = new MedicalIncidents
            {
                StudentId = incidentDto.StudentId,
                IncidentName = incidentDto.IncidentName,
                Description = incidentDto.Description,
                ClassId = incidentDto.ClassId,
                HandledBy = incidentDto.HandledBy,
                CreatedAt = DateTime.UtcNow,
                IncidentSupplies = new List<IncidentSupplies>()
            };

            foreach (var supply in incidentDto.SuppliesUsed)
            {
                incident.IncidentSupplies.Add(new IncidentSupplies
                {
                    SupplyId = supply.SupplyId,
                    QuantityUsed = supply.QuantityUsed
                });
            }

            _context.Add(incident);
            await _context.SaveChangesAsync();


            var response = new IncidentDTO
            {

                IncidentName = incident.IncidentName,
                Description = incident.Description,
                HandledBy = incident.HandledBy,
                OccurredAt = incident.CreatedAt,
                SuppliesUsed = incident.IncidentSupplies.Select(s => new SupplyUsedDTO
                {
                    SupplyId = s.SupplyId,
                    QuantityUsed = s.QuantityUsed
                }).ToList()
            };

            return response;
        }

        public async Task<List<IncidentSuppliesDTO>> GetAllIncidentSuppliesHistoryAsync()
        {
            var incidents = await _context.MedicalIncidents
                .Include(i => i.Class)
                .Include(i => i.Student)
                .Include(i => i.IncidentSupplies)
                    .ThenInclude(isup => isup.Supply)
                .ToListAsync();

            return incidents.Select(i => new IncidentSuppliesDTO
            {
                IncidentId = i.IncidentId,
                ClassName = i.Class?.ClassName,
                StudentName = i.Student?.FullName,
                IncidentName = i.IncidentName,
                Description = i.Description,
                HandledBy = i.HandledBy,
                CreatedAt = i.CreatedAt,
                SuppliesUsed = i.IncidentSupplies.Select(isup => new MedicalSuppliesDTO
                {
                    SupplyId = isup.Supply?.SupplyId ?? 0,
                    SupplyName = isup.Supply?.SupplyName,
                    Quantity = isup.QuantityUsed
                }).ToList()
            }).ToList();
        }
        public async Task<Students> GetStudentWithGuardianAndClassAsync(int studentId)
        {
            return await _context.Students
                .Include(s => s.Class)
                .Include(s => s.Guardian)
                .FirstOrDefaultAsync(s => s.StudentId == studentId);
        }
        public async Task<IncidentDTO> GetByIdAsync(int id)
        {
            return await _context.MedicalIncidents
                .Where(i => i.IncidentId == id)
                .Select(i => new IncidentDTO
                {

                    IncidentName = i.IncidentName,
                    Description = i.Description,

                    HandledBy = i.HandledBy,
                    OccurredAt = i.OccurredAt
                }).FirstOrDefaultAsync();
        }
        public async Task<List<IncidentDTO>> GetIncidentsByGuardianIdAsync(int guardianId)
        {
            return await _context.MedicalIncidents
                .Include(i => i.Student).ThenInclude(s => s.Class)
                .Where(i => i.Student.GuardianId == guardianId)
                .Select(i => new IncidentDTO
                {
                    StudentId = i.StudentId,
                    ClassId = i.Student.ClassId,
                    IncidentName = i.IncidentName,
                    Description = i.Description,
                    HandledBy = i.HandledBy,
                    OccurredAt = i.OccurredAt,
                    StudentName = i.Student.FullName,
                    ClassName = i.Student.Class.ClassName
                })
                .ToListAsync();
        }
    }
}
