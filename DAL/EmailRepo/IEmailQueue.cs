using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.EmailRepo
{
    public interface IEmailQueue
    {
        void Enqueue(EmailMessageDto message);
        bool TryDequeue(out EmailMessageDto message);
    }
}
