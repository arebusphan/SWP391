using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class UserDTO
    {

            public string FullName { get; set; }
            public string PhoneNumber { get; set; }
            public string Email { get; set; }
            public int RoleId { get; set; }
        public Boolean IsActive { get; set; }
        public int? UserId { get; set; }
        public string Role { get; set; }

    }
}
