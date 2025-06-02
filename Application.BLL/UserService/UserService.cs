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
            var user = new Users
            {
                FullName = dto.FullName,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                RoleId = dto.RoleId,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.Now
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
                
            }).ToList();

            return userDtos;
        }
    }
       
    }

