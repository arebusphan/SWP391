namespace DAL.Models
{
    public class StudentDTO
    {
        public int StudentId { get; set; }
        public string FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }

        public int GuardianId { get; set; }
        public string GuardianName { get; set; }
        public string GuardianPhone { get; set; }
        public string ClassName {  get; set; }
        public int ClassId { get; set; }
    }
}
