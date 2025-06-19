using DAL;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace BLL.HealthProfile
{
    public class HealthProfileService : IHealthProfileService
    {
        private readonly AppDbContext _context;

        public HealthProfileService(AppDbContext context)
        {
            _context = context;
        }

        public async Task SubmitAsync(HealthProfileCreateDTO dto, int createdBy)
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.StudentId == dto.StudentId && s.GuardianId == createdBy);

            if (student == null)
                throw new Exception("Student not found or not under this guardian.");

            var profile = new HealthDeclarations
            {
                StudentId = dto.StudentId,
                Allergies = dto.Allergies,
                ChronicDiseases = dto.ChronicDiseases,
                Vision = dto.Vision,
                Hearing = dto.Hearing,
                OtherNotes = dto.OtherNotes,
                CreatedBy = createdBy,
                CreatedAt = DateTime.Now
            };

            _context.HealthDeclarations.Add(profile);
            await _context.SaveChangesAsync();
        }



        public async Task<List<HealthProfileDTO>> GetPendingProfilesAsync()
        {
            return await _context.HealthDeclarations
                .Include(h => h.Students)
                .Select(h => new HealthProfileDTO
                {
                    StudentId = h.StudentId,
                    Allergies = h.Allergies,
                    ChronicDiseases = h.ChronicDiseases,
                    Vision = h.Vision,
                    Hearing = h.Hearing,
                    OtherNotes = h.OtherNotes
                })
                .ToListAsync();
        }

        public async Task<HealthProfileDTO?> GetByStudentIdAsync(int studentId)
        {
            var profile = await _context.HealthDeclarations
                .Where(p => p.StudentId == studentId)
                .OrderByDescending(p => p.CreatedAt)
                .FirstOrDefaultAsync();

            if (profile == null) return null;

            return new HealthProfileDTO
            {
                Id = profile.DeclarationId,
                StudentId = profile.StudentId,
                Allergies = profile.Allergies,
                ChronicDiseases = profile.ChronicDiseases,
                Vision = profile.Vision,
                Hearing = profile.Hearing,
                OtherNotes = profile.OtherNotes
            };
        }
        public async Task<List<HealthProfileDTO>> GetProfilesByUserAsync(int userId)
        {
            var latestPerStudent = await _context.HealthDeclarations
                .Where(h => h.CreatedBy == userId)
                .GroupBy(h => h.StudentId)
                .Select(g => g.OrderByDescending(x => x.CreatedAt).First())
                .ToListAsync();

            return latestPerStudent.Select(h => new HealthProfileDTO
            {
                Id = h.DeclarationId,
                StudentId = h.StudentId,
                Allergies = h.Allergies,
                ChronicDiseases = h.ChronicDiseases,
                Vision = h.Vision,
                Hearing = h.Hearing,
                OtherNotes = h.OtherNotes
            }).ToList();
        }


        public async Task UpdateAsync(int id, HealthProfileCreateDTO dto, int userId)
        {
            var profile = await _context.HealthDeclarations
                .FirstOrDefaultAsync(p => p.DeclarationId == id && p.CreatedBy == userId);

            if (profile == null)
                throw new Exception("Profile not found or unauthorized");

            // Cập nhật dữ liệu
            profile.StudentId = dto.StudentId;
            profile.Allergies = dto.Allergies;
            profile.ChronicDiseases = dto.ChronicDiseases;
            profile.Vision = dto.Vision;
            profile.Hearing = dto.Hearing;
            profile.OtherNotes = dto.OtherNotes;

            await _context.SaveChangesAsync(); // Cập nhật, KHÔNG được Add mới
        }
    }
}
