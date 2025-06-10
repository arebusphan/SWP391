using DAL.Models;

public interface IBannerService
{
    Task<IEnumerable<Banners>> GetAllAsync();
    Task<Banners?> GetByIdAsync(int id);
    Task<Banners> CreateAsync(Banners banner);
    Task<bool> UpdateAsync(int id, Banners banner);
    Task<bool> DeleteAsync(int id);
}
    