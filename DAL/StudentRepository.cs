﻿using DAL.Models;
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
                .Include(s => s.Guardian)
                .Where(s => s.GuardianId == guardianId)
                .ToList();
        }
        public List<StudentBasicInfoDTO> GetAllBasicProfiles()
        {
            return _context.Students
                .Include(s => s.Guardian)
                .Select(s => new StudentBasicInfoDTO
                {
                    StudentId = s.StudentId,
                    FullName = s.FullName,
                    Gender = s.Gender,
                    DateOfBirth = s.DateOfBirth,
                    GuardianName = s.Guardian.FullName,
                    GuardianPhone = s.Guardian.PhoneNumber
                })
                .ToList();
        }
        public async Task AddAsync(Students student)
        {
            await _context.Students.AddAsync(student);
            await _context.SaveChangesAsync();
        }
    }
}
