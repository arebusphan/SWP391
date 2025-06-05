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

        public async Task<(bool Success, string Message, Users user)> LoginUserAsync(LoginDTO loginDTO)
        {
            if (loginDTO == null || string.IsNullOrWhiteSpace(loginDTO.PhoneNumber))
            {
                return (false, "Phone number can not empty", null);
            }
            var user = await _context.Users.Include(u=>u.Role).FirstOrDefaultAsync(u => u.PhoneNumber == loginDTO.PhoneNumber);
            if (user == null)
            {
                return (false, "No user found with this number", null);
            }
            string token = CreateToken(user);
            return (true, "Login success", user);
        
        }
    
        public string CreateToken(Users user)
        {
            var roleName = user.Role?.RoleName ?? "Unknown";
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim("Name", user.FullName),
                new Claim("Phone", user.PhoneNumber),
                new Claim("Email", user.Email),
                new Claim("Role", roleName),


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



