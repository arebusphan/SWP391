using BLL.Interfaces;
using DAL.ClassesRepo;
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
        public async Task<List<ClassDTO>> GetAllClassesAsync()
        {
            var classes = await _repo.GetAllAsync();
            return classes.Select(c => new ClassDTO
            {
                ClassId = c.ClassId,
                ClassName = c.ClassName
            }).ToList();
        }
        public async Task<int?> GetClassIdByNameAsync(string className)
        {
            var cls = await _repo.GetByNameAsync(className);
            return cls?.ClassId;
        }
    }
}
