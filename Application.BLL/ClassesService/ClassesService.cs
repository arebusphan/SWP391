using BLL.Interfaces;
using DAL.Interfaces;
using DAL.Models;

namespace BLL.Services
{
    public class ClassesService : IClassesService
    {
        private readonly IClassesRepository _repo;

        public ClassesService(IClassesRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<Classes>> GetAllAsync()
        {
            return await _repo.GetAllAsync();
        }
    }
}
