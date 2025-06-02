using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
namespace DAL
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Users user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync(); 
        }
        public async Task<List<Users>> GetAllAsync()
        {
            return await _context.Users.Include(u=>u.Role).ToListAsync();
        }
    }
}
