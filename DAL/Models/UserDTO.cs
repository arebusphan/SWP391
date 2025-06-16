namespace DAL.Models
{
    public class UserDTO
    {
        public int? UserId { get; set; }  // Dùng trong trường hợp update

        public string FullName { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public int RoleId { get; set; }  // Sử dụng RoleId từ client truyền lên
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }
}
