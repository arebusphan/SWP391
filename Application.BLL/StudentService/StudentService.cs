using BLL.StudentService;
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

    public async Task AddStudentsAsync(List<StudentAddDTO> studentDtos, int guardianId)
    {
        var validStudents = studentDtos
            .Where(s => !string.IsNullOrWhiteSpace(s.FullName)
                     && s.DateOfBirth != default
                     && !string.IsNullOrWhiteSpace(s.Gender))
            .Select(s => new Students
            {
                FullName = s.FullName,
                DateOfBirth = s.DateOfBirth,
                Gender = s.Gender,
                GuardianId = guardianId,
                ClassId = s.ClassId,
            }).ToList();

        if (validStudents.Any())
        {
            await _studentRepository.AddAsync(validStudents);
        }
    }
    public async Task<IEnumerable<StudentDTO>> GetStudentsByClassAsync(int classId)
    {
        var students = await _studentRepository.GetByClassIdAsync(classId);

        return students.Select(s => new StudentDTO
        {
            StudentId = s.StudentId,
            FullName = s.FullName,
            DateOfBirth = s.DateOfBirth,
            Gender = s.Gender,
            GuardianId = s.GuardianId,
            GuardianName = s.Guardian?.FullName ?? string.Empty,
            GuardianPhone = s.Guardian?.PhoneNumber ?? string.Empty
        });
    }
}
