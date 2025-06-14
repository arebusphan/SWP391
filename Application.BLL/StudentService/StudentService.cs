﻿using BLL.StudentService;
using DAL.Models;
using DAL.Repositories;
using System.Collections.Generic;
using System.Linq;

public class StudentService : IStudentService
{
    private readonly IStudentRepository _studentRepository;

    public StudentService(IStudentRepository studentRepository)
    {
        _studentRepository = studentRepository;
    }

    public List<StudentDTO> GetStudentsByGuardian(int guardianId)
    {
        var students = _studentRepository.GetStudentsByGuardian(guardianId);

        return students.Select(s => new StudentDTO
        {
            StudentId = s.StudentId,
            FullName = s.FullName,
            DateOfBirth = s.DateOfBirth,
            Gender = s.Gender,


            GuardianId = s.GuardianId,
            GuardianName = s.Guardian?.FullName,
            GuardianPhone = s.Guardian?.PhoneNumber

        }).ToList();
    }

    

    public List<StudentBasicInfoDTO> GetAllBasicProfiles()
    {
        return _studentRepository.GetAllBasicProfiles();
    }



}
