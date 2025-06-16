using DAL.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class Users
{
    [Key]
    public int UserId { get; set; }

    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [MaxLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public int? RoleId { get; set; }

    public DateTime? CreatedAt { get; set; } = DateTime.Now;

    public DateTime? UpdatedAt { get; set; }

    public ICollection<Otps>? Otps { get; set; }

    [ForeignKey("RoleId")]
    public Roles? Role { get; set; }

    public ICollection<Students>? Students { get; set; }
}
