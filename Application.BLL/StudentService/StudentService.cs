using BLL.StudentService;
using DAL.Models;
using DAL.StudentRepo;
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
            GuardianPhone = s.Guardian?.PhoneNumber,
            ClassName = s.Class.ClassName,
            ClassId = s.ClassId

        }).ToList();
    }

    

    public List<StudentBasicInfoDTO> GetAllBasicProfiles()
    {
        return _studentRepository.GetAllBasicProfiles();
    }

    public async Task AddStudentsAsync(List<StudentAddDTO> studentDtos, int guardianId)
    {
        if (studentDtos == null || studentDtos.Count == 0)
            return;

        var validStudents = new List<Students>();

        foreach (var s in studentDtos)
        {
            // Kiểm tra từng trường tránh lỗi null
            if (string.IsNullOrWhiteSpace(s.FullName)) continue;
            if (s.DateOfBirth == default) continue;
            if (string.IsNullOrWhiteSpace(s.Gender)) continue;

            validStudents.Add(new Students
            {
                FullName = s.FullName,
                DateOfBirth = s.DateOfBirth,
                Gender = s.Gender,
                GuardianId = guardianId,
                ClassId = s.ClassId
            });
        }

        if (validStudents.Count > 0)
        {
            await _studentRepository.AddAsync(validStudents);
        }
    }

    public async Task<IEnumerable<StudentDTO>> GetStudentsByClassAsync(int classId)
    {
        return await _studentRepository.GetByClassIdAsync(classId);
    }
    public async Task<List<StudentDTO>> GetAllStudentDtosAsync()
    {
        return await _studentRepository.GetStudentDTOsAsync();
    }
    public async Task UpdateStudentAsync(int studentId, UpdateStudent updatedStudent)
    {
        var existingStudent = await _studentRepository.GetGuardianEmailByStudentIdAsync(studentId); // Chỉ cần lấy student

        if (existingStudent == null)
            throw new Exception("Student not found");

        existingStudent.FullName = updatedStudent.FullName;

        if (DateTime.TryParse(updatedStudent.DateOfBirth, out var dob))
        {
            existingStudent.DateOfBirth = dob;
        }
        else
        {
            throw new Exception("Invalid date format.");
        }

        existingStudent.Gender = updatedStudent.Gender;
        existingStudent.ClassId = updatedStudent.ClassId;

        await _studentRepository.UpdateAsync(existingStudent);
    }


}
