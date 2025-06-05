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
            return await _context.Users.Include(u => u.Role).ToListAsync();
        }
        public async Task<bool> ExistsByEmailOrPhoneAsync(string email, string phone)
        {
            return await _context.Users.AnyAsync(u => u.Email == email || u.PhoneNumber == phone);
        }
        public async Task<bool> UpdateAsync(UserUpdateDTO user)
        {
            var finduser = await _context.Users.FindAsync(user.UserId);
            if (finduser == null)
            {
                return false;
            }
            finduser.FullName = user.FullName;
            finduser.Email = user.Email;
            finduser.PhoneNumber = user.PhoneNumber;
            finduser.UpdatedAt = DateTime.Now;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DeleteAsyns(UserDeleteDTO user)
        {
            var finduser = await _context.Users.FindAsync(user.UserId);
            if (finduser == null) { return false; }
            finduser.IsActive = false;
            finduser.UpdatedAt = DateTime.Now;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
