using DAL.Models;
using System.Collections.Generic;

namespace BLL.HealthNotificationService
{
    public interface IHealthNotificationService
    {
        List<HealthNotificationDTO> GetNotificationsForParent(int parentUserId);
    }
}     
