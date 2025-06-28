using DAL.Models;

namespace DAL.Interfaces
{
    public interface IClassesRepository
    {
        Task<List<Classes>> GetAllAsync();
        Task<Classes?> GetByNameAsync(string className);

    }
}
