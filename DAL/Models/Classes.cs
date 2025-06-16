using System.ComponentModel.DataAnnotations;

namespace DAL.Models
{
    public class Classes
    {
        [Key]
        public int ClassId { get; set; }
        public string ClassName { get; set; }

        public ICollection<StudentClasses> StudentClasses { get; set; }
    }
}
