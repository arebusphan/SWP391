using DAL.Models;
using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static DAL.Models.UserDTO;
using DAL.Repositories;
using BLL.StudentService;

namespace BLL.UserService
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;
        private readonly IStudentService _studentService;

        public UserService(IUserRepository repo, IStudentService studentService)
        {
            _repo = repo;
            _studentService = studentService;
        }

        public async Task CreateUserAsync(ParentWithStudentDTO dto)
        {
            var existingUser = await _repo.GetUserByEmailOrPhoneAsync(dto.Parent.Email, dto.Parent.PhoneNumber);

            if (existingUser != null)
            {
                throw new Exception("Email or phone number already exists");
            }

            var user = new Users
            {
                FullName = dto.Parent.FullName,
                PhoneNumber = dto.Parent.PhoneNumber,
                Email = dto.Parent.Email,
                RoleId = dto.Parent.RoleId, // ✅ Dùng trực tiếp RoleId từ JSON
                IsActive = dto.Parent.IsActive,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            user = await _repo.AddAsync(user);

            // ✅ Nếu có danh sách học sinh thì thêm
            if (dto.Students != null && dto.Students.Any())
            {
                await _studentService.AddStudentsAsync(dto.Students, user.UserId);
            }
        }

        public async Task<List<UserDTO>> GetAllAsync()
        {
            var users = await _repo.GetAllAsync();
            var userDtos = users.Select(u => new UserDTO
            {
                FullName = u.FullName,
                IsActive = u.IsActive,
                PhoneNumber = u.PhoneNumber,
                Email = u.Email,
                Role = u.Role.RoleName,
                UserId = u.UserId,
            }).ToList();

            return userDtos;
        }

        public async Task<bool> UpdateAsync(UserUpdateDTO dto)
        {
            if (string.IsNullOrEmpty(dto.FullName) || string.IsNullOrEmpty(dto.PhoneNumber) || string.IsNullOrEmpty(dto.Email))
            {
                return false;
            }

            return await _repo.UpdateAsync(dto);
        }

        public async Task<bool> DeleteAsync(UserDeleteDTO dto)
        {
            return await _repo.DeleteAsyns(dto);
        }
        public async Task<UserDTO?> FindUserByEmailOrPhoneAsync(string email, string phone)
        {
            return await _repo.GetUserByEmailOrPhoneAsync(email, phone);
        }

    }
}
