﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
using DAL.Models;

namespace BLL.AuthService
{
    public interface IAuthService
    {
        Task<(bool Success, string Message, Users user)> LoginUserAsync(LoginDTO loginDTO);
        string CreateToken(Users user);
    }
}
