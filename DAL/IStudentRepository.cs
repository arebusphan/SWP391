using DAL.Models;
using System.Collections.Generic;

namespace DAL.Repositories
{
    public interface IStudentRepository
    {
        List<Students> GetStudentsByGuardian(int guardianId);
        List<StudentBasicInfoDTO> GetAllBasicProfiles();
        Task AddAsync(List<Students> students);
        Task<IEnumerable<StudentDTO>> GetByClassIdAsync(int classId);
        Task<List<StudentDTO>> GetStudentDTOsAsync();

    }
}
