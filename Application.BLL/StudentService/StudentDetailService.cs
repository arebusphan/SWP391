using DAL.Models;
using DAL.Repositories;

namespace BLL.StudentDetailService
{
    public class StudentDetailService : IStudentDetailService
    {
        private readonly IStudentDetailRepository _repository;

        public StudentDetailService(IStudentDetailRepository repository)
        {
            _repository = repository;
        }

        public StudentDetailDto GetStudentDetail(int studentId)
        {
            return _repository.GetStudentDetail(studentId);
        }
    }
}
