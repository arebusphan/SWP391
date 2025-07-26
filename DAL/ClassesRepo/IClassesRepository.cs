using DAL.Models;

namespace DAL.ClassesRepo
{
    public interface IClassesRepository
    {
        Task<List<Classes>> GetAllAsync();
        Task<Classes?> GetByNameAsync(string className);

    }
}
