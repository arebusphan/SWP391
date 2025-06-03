using DAL.Models;
using System.Collections.Generic;

namespace DAL.Repositories
{
    public interface IHealthNotificationRepository
    {
        List<HealthNotificationDTO> GetNotificationsForParent(int parentUserId);
    }
}
