using DAL.Models;
using System.Collections.Generic;

namespace DAL.Repositories
{
    public interface IStudentStatusRepository
    {
        List<StudentHealthStatusDTO> GetStudentStatusByGuardian(int guardianId);
        List<StudentHealthStatusDTO> GetAllStudentStatus();

    }
}
