using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace DAL.Repositories
{
    public class HealthNotificationRepository : IHealthNotificationRepository
    {
        private readonly AppDbContext _context;

        public HealthNotificationRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<HealthNotificationDTO> GetNotificationsForParent(int parentUserId)
        {
            var result = (from s in _context.Students
                          join ns in _context.NotificationStudents on s.StudentId equals ns.StudentId
                          join n in _context.HealthNotifications on ns.NotificationId equals n.NotificationId
                          where s.GuardianId == parentUserId
                          select new HealthNotificationDTO
                          {
                              NotificationId = n.NotificationId,
                              NotificationType = n.NotificationType,
                              Title = n.Title,
                              Content = n.Content,
                              CreatedAt = n.CreatedAt,
                              ParentConfirmed = ns.ParentConfirmed,
                              ConfirmedAt = ns.ConfirmedAt,
                              StudentId = s.StudentId,
                              StudentName = s.FullName
                          }).ToList();

            return result;
        }
    }
}
