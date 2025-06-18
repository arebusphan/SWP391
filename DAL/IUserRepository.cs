using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public interface IUserRepository
    {
        Task<Users> AddAsync(Users user);
        Task<List<Users>> GetAllAsync();
        Task<UserDTO?> GetUserByEmailOrPhoneAsync(string email, string phone);
        Task<bool> UpdateAsync(UserUpdateDTO user);
        Task<bool> DeleteAsyns(UserDeleteDTO dto);
    }
}
