using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Models;

namespace BLL.StudentService
{
    public interface IStudentService
    {
        List<StudentDTO> GetStudentsByGuardian(int guardianId);
        List<StudentBasicInfoDTO> GetAllBasicProfiles();
        Task AddStudentsAsync(List<StudentAddDTO> studentDtos, int guardianId);
        Task<IEnumerable<StudentDTO>> GetStudentsByClassAsync(int classId);
        Task<List<StudentDTO>> GetAllStudentDtosAsync();
        Task UpdateStudentAsync(int studentId, UpdateStudent updatedStudent);
    }
    }