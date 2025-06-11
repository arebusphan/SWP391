using DAL.Models;

namespace BLL.StudentDetailService
{
    public interface IStudentDetailService
    {
        StudentDetailDto GetStudentDetail(int studentId);
    }
}
