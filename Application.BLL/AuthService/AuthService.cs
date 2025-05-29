using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
using DAL.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
namespace BLL.AuthService;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.Extensions.Configuration;
using BLL.AuthService;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;


    public AuthService(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<(bool Success, string Message, User user)> LoginUserAsync(LoginDTO loginDTO)
    {
        if (loginDTO == null || string.IsNullOrWhiteSpace(loginDTO.Phone))
        {
            return (false, "Phone number can not empty", null);
        }
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Phone == loginDTO.Phone);
        if (user == null)
        {
            return (false, "No user found with this number", null);
        }
        string token = CreateToken(user);
        return (true, "Login success", user);
    }
    public string CreateToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.username),
            new Claim(ClaimTypes.MobilePhone, user.Phone),
            new Claim(ClaimTypes.Email, user.gmail),
            new Claim(ClaimTypes.Role, user.Role),

        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["AppSettings:Token"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

        var tokenDescriptor = new JwtSecurityToken(
            issuer: _configuration["AppSettings:Issuer"],
            audience: _configuration["AppSettings:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
    }
}



