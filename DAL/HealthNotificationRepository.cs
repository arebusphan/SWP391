﻿using DAL;
using Microsoft.EntityFrameworkCore;
using DAL.Models;
public class HealthNotificationRepository : IHealthNotificationRepository
{
    private readonly AppDbContext _context;
    public HealthNotificationRepository(AppDbContext context) => _context = context;

    public async Task<int> CreateAsync(HealthNotification notification, List<int> classIds)
    {
        _context.HealthNotifications.Add(notification);
        await _context.SaveChangesAsync();

        foreach (var classId in classIds)
        {
            // Gắn notification với class
            _context.NotificationClasses.Add(new NotificationClass
            {
                NotificationId = notification.NotificationId,
                ClassId = classId
            });

            // Lấy danh sách học sinh trong lớp
            var students = _context.Students
                .Where(s => s.ClassId == classId)
                .ToList();

            foreach (var student in students)
            {
                var parentPhone = _context.Users
                    .Where(u => u.UserId == student.GuardianId)
                    .Select(u => u.PhoneNumber)
                    .FirstOrDefault();

                // Gửi notification đến từng học sinh
                _context.NotificationStudents.Add(new NotificationStudent
                {
                    NotificationId = notification.NotificationId,
                    StudentId = student.StudentId,
                    ConfirmStatus = "Pending",
                    ParentPhone = parentPhone
                });
            }
        }

        await _context.SaveChangesAsync();
        return notification.NotificationId;
    }


    // ✅ Trả về lịch sử theo DTO
    public async Task<List<NotificationHistoryDTO>> GetNotificationHistoriesAsync()
    {
        var data = await _context.NotificationClasses
            .Include(nc => nc.Notification)
            .Include(nc => nc.Class)
            .Select(nc => new NotificationHistoryDTO
            {
                Id = nc.Notification.NotificationId,
                EventName = nc.Notification.EventName,
                EventType = nc.Notification.EventType,
                EventDate = nc.Notification.EventDate,
                ClassName = nc.Class.ClassName,
                EventImage = nc.Notification.EventImage // thêm dòng này
            })
            .ToListAsync();

        return data;
    }
    public async Task<List<HealthNotificationBasicDTO>> GetAllBasicAsync()
    {
        return await _context.HealthNotifications
            .Select(n => new HealthNotificationBasicDTO
            {
                NotificationId = n.NotificationId,
                EventName = n.EventName,
                EventDate = n.EventDate
            })
            .OrderByDescending(n => n.EventDate)
            .ToListAsync();
    }


}
