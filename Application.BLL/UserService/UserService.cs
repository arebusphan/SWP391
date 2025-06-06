using DAL.Models;
using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static DAL.Models.UserDTO;

namespace BLL.UserService
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;

        public UserService(IUserRepository repo)
        {
            _repo = repo;
        }

        public async Task CreateUserAsync(UserDTO dto)
        {
            if (await _repo.ExistsByEmailOrPhoneAsync(dto.Email, dto.PhoneNumber))
            {
                throw new Exception("email or phone number is exists");
            }
            var user = new Users
            {
                FullName = dto.FullName,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                RoleId = dto.RoleId,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now

            };

            await _repo.AddAsync(user);
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
    }

}

