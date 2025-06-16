public class NotificationStudent
{
    public int Id { get; set; }
    public int NotificationId { get; set; }
    public int StudentId { get; set; }
    public string? ConfirmStatus { get; set; }  // Pending, Confirmed, Declined
    public string? DeclineReason { get; set; }
    public string? ParentPhone { get; set; }
}
