using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class EmailQueueItem
    {
        public EmailMessageDto? Single { get; set; }
        public List<EmailMessageDto>? Batch { get; set; }

        public bool IsBatch => Batch != null && Batch.Count > 0;
    }

}
