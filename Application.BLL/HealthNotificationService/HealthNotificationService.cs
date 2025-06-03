using DAL.Models;
using DAL.Repositories;
using System.Collections.Generic;

namespace BLL.HealthNotificationService
{
    public class HealthNotificationService : IHealthNotificationService
    {
        private readonly IHealthNotificationRepository _repository;

        public HealthNotificationService(IHealthNotificationRepository repository)
        {
            _repository = repository;
        }

        public List<HealthNotificationDTO> GetNotificationsForParent(int parentUserId)
        {
            return _repository.GetNotificationsForParent(parentUserId);
        }
    }
}
