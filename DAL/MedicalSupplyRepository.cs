using DAL;
using Microsoft.EntityFrameworkCore;

public class MedicalSupplyRepository : IMedicalSupplyRepository
{
    private readonly AppDbContext _context;

    public MedicalSupplyRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(MedicalSupply supply)
    {
        _context.MedicalSupplies.Add(supply);
        await _context.SaveChangesAsync();
    }

    public async Task<List<MedicalSupply>> GetAllAsync()
    {
        return await _context.MedicalSupplies.ToListAsync();
    }
}
