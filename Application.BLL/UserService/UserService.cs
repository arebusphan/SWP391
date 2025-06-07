using DAL.Models;
using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static DAL.Models.UserDTO;
using DAL.Repositories;

namespace BLL.UserService
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;
        private readonly IStudentRepository _stud;

        public UserService(IUserRepository repo, IStudentRepository stud)
        {
            _repo = repo;
            _stud = stud;
        }

        public async Task CreateUserAsync(ParentWithStudentDTO dto)
        {
            if (await _repo.ExistsByEmailOrPhoneAsync(dto.Parent.Email, dto.Parent.PhoneNumber))
            {
                throw new Exception("email or phone number is exists");
            }
            var user = new Users
            {
                FullName = dto.Parent.FullName,
                PhoneNumber = dto.Parent.PhoneNumber,
                Email = dto.Parent.Email,
                RoleId = dto.Parent.RoleId,
                IsActive = dto.Parent.IsActive,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now

            };

            user = await _repo.AddAsync(user);

            if (dto.Parent.Role.Equals("Parent"))
            {
                bool checkstud = string.IsNullOrEmpty(dto.Student.FullName)
                    && dto.Student.DateOfBirth != default(DateTime)
                              && !string.IsNullOrWhiteSpace(dto.Student.Gender);
                if (!checkstud)
                {
                    var student = new Students
                    {
                        FullName = dto.Student.FullName,
                        DateOfBirth = dto.Student.DateOfBirth,
                        Gender = dto.Student.Gender,
                        GuardianId = user.UserId,


                    };
                    await _stud.AddAsync(student);
                }
            }
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

