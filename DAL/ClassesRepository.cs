using DAL.Models;
using DAL.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class ClassesRepository : IClassesRepository
    {
        private readonly AppDbContext _context;

        public ClassesRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Classes>> GetAllAsync()
        {
            return await _context.Classes.ToListAsync();
        }
        public async Task<Classes?> GetByNameAsync(string className)
        {
            return await _context.Classes
                .FirstOrDefaultAsync(c => c.ClassName.ToLower() == className.ToLower());
        }

    }
}
