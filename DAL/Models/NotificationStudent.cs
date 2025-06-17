using DAL.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class NotificationStudent
{
    [Key]
    public int Id { get; set; }                             // Id INT PRIMARY KEY

    [Required]
    public int NotificationId { get; set; }                 // NotificationId INT NOT NULL

    [ForeignKey("NotificationId")]
    public HealthNotification Notification { get; set; }    // FOREIGN KEY -> HealthNotifications

    [Required]
    public int StudentId { get; set; }                      // StudentId INT NOT NULL

    [ForeignKey("StudentId")]
    public Students Student { get; set; }                   // FOREIGN KEY -> Students

    public string? ConfirmStatus { get; set; }              // ConfirmStatus NVARCHAR(50)
    public string? DeclineReason { get; set; }              // DeclineReason NVARCHAR(255)
    public string? ParentPhone { get; set; }                // ParentPhone NVARCHAR(20)
}
