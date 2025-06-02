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
        Task AddAsync(Users user);
        Task<List<Users>> GetAllAsync();
        Task<bool> ExistsByEmailOrPhoneAsync(string email, string phone);
        Task<bool> UpdateAsync(UserUpdateDTO user);
        Task<bool> DeleteAsyns(int Id);
    }
}
