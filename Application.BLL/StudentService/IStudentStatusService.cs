using DAL.Models;
using System.Collections.Generic;

namespace BLL.StudentService
{
    public interface IStudentStatusService
    {
        List<StudentHealthStatusDTO> GetStatusForGuardian(int guardianId);
    }
}
