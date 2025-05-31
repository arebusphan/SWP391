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

        public async Task CreateUserAsync(UserCreateDTO dto)
        {
            var user = new Users
            {
                FullName = dto.FullName,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                RoleId = dto.RoleId,
                CreatedAt = DateTime.Now
            };

            await _repo.AddAsync(user);
        }
    }
}
