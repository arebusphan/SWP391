using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Users
    {
        [Key]
        public int UserId { get; set; } 
        public string FullName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        [NotMapped]
        public string RoleName { get; set; } = string.Empty;
        [NotMapped] 

        public string CreatedAt { get; set; } = string.Empty;

        public ICollection<Otps> Otps { get; set; }
    }
}
