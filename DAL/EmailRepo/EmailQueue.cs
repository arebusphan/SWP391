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
        private readonly ConcurrentQueue<EmailMessageDto> _queue = new();

        public void Enqueue(EmailMessageDto message)
        {
            _queue.Enqueue(message);
        }

        public bool TryDequeue(out EmailMessageDto message)
        {
            return _queue.TryDequeue(out message);
        }
    }
}
