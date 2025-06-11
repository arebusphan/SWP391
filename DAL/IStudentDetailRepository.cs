using DAL.Models;

namespace DAL.Repositories
{
    public interface IStudentDetailRepository
    {
        StudentDetailDto GetStudentDetail(int studentId);
    }
}
