    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    namespace DAL.Models
    {
        public class IncidentHistory
        {
        public int IncidentId { get; set; }
        public string IncidentName { get; set; }
        public string Description { get; set; }
        public string HandledBy { get; set; }
        public DateTime OccurredAt { get; set; }

        // Thông tin học sinh liên quan
        public int StudentId { get; set; }
        public string StudentName { get; set; }
        public string ClassName { get; set; }

        // Danh sách vật tư y tế đã dùng
        public List<UpdateSuppliesDTO> UsedSupplies { get; set; }
    }
    }
