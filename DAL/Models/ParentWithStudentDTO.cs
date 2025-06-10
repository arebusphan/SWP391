using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class ParentWithStudentDTO
    {
        public UserDTO Parent { get; set; }
        public StudentAddDTO? Student { get; set; }
    }

}
