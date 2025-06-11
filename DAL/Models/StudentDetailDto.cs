using System;
using System.Collections.Generic;

namespace DAL.Models
{
    public class StudentDetailDto
    {
        public int StudentId { get; set; }
        public string FullName { get; set; } = "";
        public string Gender { get; set; } = "";
        public DateTime DateOfBirth { get; set; }
        public string GuardianName { get; set; } = "";
        public string GuardianPhone { get; set; } = "";
        public string Allergies { get; set; } = "";
        public string ChronicDiseases { get; set; } = "";
        public string Vision { get; set; } = "";
        public string Hearing { get; set; } = "";
        public List<string> Vaccinations { get; set; } = new();
    }
}
