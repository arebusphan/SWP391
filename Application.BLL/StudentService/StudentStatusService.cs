using DAL.Models;
using DAL.Repositories;
using System.Collections.Generic;

namespace BLL.StudentService
{
    public class StudentStatusService : IStudentStatusService
    {
        private readonly IStudentStatusRepository _repository;

        public StudentStatusService(IStudentStatusRepository repository)
        {
            _repository = repository;
        }

        public List<StudentHealthStatusDTO> GetStatusForGuardian(int guardianId)
        {
            return _repository.GetStudentStatusByGuardian(guardianId);
        }
    }
}
