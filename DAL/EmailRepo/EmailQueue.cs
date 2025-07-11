using DAL.Models;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.EmailRepo
{
    public class EmailQueue : IEmailQueue
    {
        private readonly ConcurrentQueue<EmailQueueItem> _queue = new();

        public void Enqueue(EmailMessageDto message)
        {
            _queue.Enqueue(new EmailQueueItem { Single = message });
        }

        public void Enqueue(List<EmailMessageDto> batchMessages)
        {
            _queue.Enqueue(new EmailQueueItem { Batch = batchMessages });
        }

        public bool TryDequeue(out EmailQueueItem item)
        {
            return _queue.TryDequeue(out item);
        }
    }

}
