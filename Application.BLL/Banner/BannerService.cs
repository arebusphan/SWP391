using DAL.Models;
using DAL;
using Microsoft.EntityFrameworkCore;

public class BannerService : IBannerService
{
    private readonly AppDbContext _context;

    public BannerService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Banners>> GetAllAsync()
    {
        return await _context.Banners.ToListAsync();
    }

    public async Task<Banners?> GetByIdAsync(int id)
    {
        return await _context.Banners.FindAsync(id);
    }

    public async Task<Banners> CreateAsync(Banners banner)
    {
        _context.Banners.Add(banner);
        await _context.SaveChangesAsync();
        return banner;
    }

    public async Task<bool> UpdateAsync(int id, Banners banner)
    {
        if (id != banner.id) return false;
        _context.Entry(banner).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var banner = await _context.Banners.FindAsync(id);
        if (banner == null) return false;

        _context.Banners.Remove(banner);
        await _context.SaveChangesAsync();
        return true;
    }
}
