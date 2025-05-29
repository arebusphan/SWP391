using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace DAL
{
    public class User
    {

        public string username { get; set; } = string.Empty;
        public string? gmail { get; set; }
        public int userid { get; set; }
        public string Role { get; set; } = string.Empty;
        public string gender { get; set; }
        public string Phone { get; set; } = string.Empty;
    }
}
