using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Models;
using static DAL.Models.UserDTO;

namespace BLL.UserService
{
    public interface IUserService
    {
        Task CreateUserAsync(UserDTO dto);
        Task<List<UserDTO>> GetAllAsync();
        Task<bool> UpdateAsync(UserUpdateDTO user);
        Task<bool> DeleteAsync(int id);
    }
}
