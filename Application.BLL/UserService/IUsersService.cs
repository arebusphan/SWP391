using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static DAL.Models.UserDTO;

namespace BLL.UserService
{
    public interface IUserService
    {
        Task CreateUserAsync(UserCreateDTO dto);
    }
}
