using DAL.Models;

namespace BLL.Interfaces
{
    public interface IClassesService
    {
        Task<List<Classes>> GetAllAsync();
    }
}
