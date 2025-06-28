using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Blog
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string ImageUrl { get; set; }
        public string HtmlContent { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
