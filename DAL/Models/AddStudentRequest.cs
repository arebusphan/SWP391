using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class AddStudentRequest
    {
        public int GuardianId { get; set; }
        public List<StudentAddDTO> Students { get; set; } = new();
    }
}
