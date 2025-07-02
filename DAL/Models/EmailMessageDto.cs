using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class EmailMessageDto
    {
        public List<string> ToList { get; set; } = new();
        public string Subject { get; set; }
        public string Body { get; set; }
        public bool IsHtml { get; set; } = false;
    }
}
