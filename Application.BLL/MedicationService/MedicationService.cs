using DAL;
using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace BLL.MedicationService
{
    public class MedicationService : IMedicationService
    {
        private readonly AppDbContext _context;

        public MedicationService(AppDbContext context)
        {
            _context = context;
        }

        public void CreateRequest(MedicationRequestDTO dto, int parentUserId)
        {
            var request = new MedicationRequests
            {
                StudentId = dto.StudentId,
                MedicineName = dto.MedicineName,
                PrescriptionImage = dto.PrescriptionImage,
                CreatedBy = parentUserId,
                Status = "Pending"
            };

            _context.MedicationRequests.Add(request);
            _context.SaveChanges();
        }
        public List<MedicationRequestResponseDTO> GetRequestsByParent(int parentUserId)
        {
            var result = _context.MedicationRequests
                .Where(r => r.CreatedBy == parentUserId)
                .Include(r => r.Student)
                .Select(r => new MedicationRequestResponseDTO
                {
                    RequestId = r.RequestId,
                    StudentId = r.StudentId,
                    StudentName = r.Student.FullName,
                    MedicineName = r.MedicineName,
                    PrescriptionImage = r.PrescriptionImage,
                    Status = r.Status,
                    CreatedAt = r.CreatedAt
                })
                .ToList();

            return result;
        }

    }
}
