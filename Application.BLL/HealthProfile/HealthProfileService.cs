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

        public async Task SubmitAsync(HealthProfileDTO dto, int createdBy)
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.StudentId == dto.StudentId && s.GuardianId == createdBy);

            if (student == null)
                throw new Exception("Student not found or not under this guardian.");

            var existed = await _context.HealthProfiles
                .AnyAsync(h => h.StudentId == dto.StudentId);

            if (existed)
                throw new Exception("Health profile already submitted for this student.");

            var profile = new DAL.Models.HealthProfile
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

            _context.HealthProfiles.Add(profile);
            await _context.SaveChangesAsync();
        }




        public async Task<List<HealthProfileDTO>> GetPendingProfilesAsync()
        {
            var studentsWithProfile = await _context.HealthProfiles
                .Select(h => h.StudentId)
                .Distinct()
                .ToListAsync();

            var pendingStudents = await _context.Students
                .Where(s => !studentsWithProfile.Contains(s.StudentId))
                .Include(s => s.Guardian)
                .ToListAsync();

            return pendingStudents.Select(s => new HealthProfileDTO
            {
                StudentId = s.StudentId,
                OtherNotes = $"Guardian: {s.Guardian?.FullName}, Phone: {s.Guardian?.PhoneNumber}"
            }).ToList();
        }


        public async Task<HealthProfileDTO?> GetByStudentIdAsync(int studentId)
        {
            var profile = await _context.HealthProfiles
                .Where(p => p.StudentId == studentId)
                .OrderByDescending(p => p.CreatedAt)
                .FirstOrDefaultAsync();

            if (profile == null) return null;

            return new HealthProfileDTO
            {
                DeclarationId = profile.DeclarationId,
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
            var latestPerStudent = await _context.HealthProfiles
                .Where(h => h.CreatedBy == userId)
                .GroupBy(h => h.StudentId)
                .Select(g => g.OrderByDescending(x => x.CreatedAt).First())
                .ToListAsync();

            return latestPerStudent.Select(h => new HealthProfileDTO
            {
                DeclarationId = h.DeclarationId,
                StudentId = h.StudentId,
                Allergies = h.Allergies,
                ChronicDiseases = h.ChronicDiseases,
                Vision = h.Vision,
                Hearing = h.Hearing,
                OtherNotes = h.OtherNotes
            }).ToList();
        }


        public async Task UpdateAsync(int id, HealthProfileDTO dto, int userId)
        {
            var profile = await _context.HealthProfiles
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
        public async Task SendReminderToGuardianAsync(int studentId)
        {
            var student = await _context.Students
                .Include(s => s.Guardian)
                .FirstOrDefaultAsync(s => s.StudentId == studentId);

            if (student?.Guardian == null)
                throw new Exception("Guardian not found");

            var guardian = student.Guardian;

            // TODO: thay bằng lệnh gửi email/thông báo thật
            Console.WriteLine($"🔔 Gửi thông báo tới phụ huynh: {guardian.FullName} - {guardian.PhoneNumber}");

            // hoặc tạo record vào bảng Notifications nếu có
        }

    }
}
