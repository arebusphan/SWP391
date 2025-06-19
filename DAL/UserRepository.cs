using DAL.Models; // Sử dụng các lớp model trong namespace DAL.Models
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore; // Sử dụng Entity Framework Core để tương tác với cơ sở dữ liệu

namespace DAL
{
    // Lớp này triển khai interface IUserRepository, xử lý các thao tác CRUD với bảng Users
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context; // Context kết nối với CSDL

        // Constructor nhận context để dùng trong toàn bộ class
        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        // Thêm người dùng mới vào database
        public async Task<Users> AddAsync(Users user)
        {
            await _context.Users.AddAsync(user); // Thêm bản ghi vào DbSet Users
            await _context.SaveChangesAsync();   // Lưu thay đổi xuống CSDL
            return user; // Trả về user đã thêm
        }

        // Lấy toàn bộ danh sách người dùng, bao gồm cả thông tin Role liên quan
        public async Task<List<Users>> GetAllAsync()
        {
            return await _context.Users.Include(u => u.Role).ToListAsync(); // Dùng Include để lấy thêm thông tin Role
        }

        // Tìm người dùng theo email hoặc số điện thoại, trả về kiểu UserDTO
        public async Task<UserDTO?> GetUserByEmailOrPhoneAsync(string email, string phone)
        {
            return await _context.Users
                .Where(u => u.Email == email || u.PhoneNumber == phone) // Lọc theo email hoặc số điện thoại
                .Select(u => new UserDTO // Chuyển sang DTO để tránh lộ thông tin nhạy cảm
                {
                    UserId = u.UserId,
                    FullName = u.FullName,
                    PhoneNumber = u.PhoneNumber,
                    Email = u.Email,
                })
                .FirstOrDefaultAsync(); // Trả về bản ghi đầu tiên tìm được hoặc null
        }

        // Cập nhật thông tin người dùng
        public async Task<bool> UpdateAsync(UserUpdateDTO user)
        {
            var finduser = await _context.Users.FindAsync(user.UserId); // Tìm người dùng theo ID
            if (finduser == null)
            {
                return false; // Nếu không tìm thấy thì trả về false
            }
            // Cập nhật thông tin từ DTO
            finduser.FullName = user.FullName;
            finduser.Email = user.Email;
            finduser.PhoneNumber = user.PhoneNumber;
            finduser.UpdatedAt = DateTime.Now; // Cập nhật thời gian sửa
            await _context.SaveChangesAsync(); // Lưu thay đổi
            return true;
        }

        // Xóa mềm (soft delete) người dùng - chuyển trạng thái IsActive thành false
        public async Task<bool> DeleteAsyns(UserDeleteDTO user)
        {
            var finduser = await _context.Users.FindAsync(user.UserId); // Tìm người dùng theo ID
            if (finduser == null) { return false; }
            finduser.IsActive = false; // Đánh dấu là không còn hoạt động thay vì xóa hẳn
            finduser.UpdatedAt = DateTime.Now; // Ghi lại thời gian cập nhật
            await _context.SaveChangesAsync(); // Lưu thay đổi
            return true;
        }
    }
}
