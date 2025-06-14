﻿using DAL.Models;
using System.Collections.Generic;

namespace DAL.Repositories
{
    public interface IStudentRepository
    {
        List<Students> GetStudentsByGuardian(int guardianId);
        List<StudentBasicInfoDTO> GetAllBasicProfiles();
        Task AddAsync(Students student);
    }
}
