using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DAL.Models
{
    [Table("Classes")]
    public class Classes
    {
        [Key]
        public int ClassId { get; set; }

        [Required]
        [MaxLength(100)]
        public string ClassName { get; set; } = null!;

        // Quan hệ 1 - nhiều: 1 Class có nhiều Students
        public ICollection<Students> Students { get; set; } = new List<Students>();

        // Quan hệ với NotificationClasses
        public ICollection<NotificationClass> NotificationClasses { get; set; } = new List<NotificationClass>();

    }
}
