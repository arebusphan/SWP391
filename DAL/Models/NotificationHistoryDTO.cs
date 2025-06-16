public class NotificationHistoryDTO
{
    public int Id { get; set; }
    public string EventName { get; set; }
    public string EventType { get; set; }
    public DateTime EventDate { get; set; }
    public string ClassName { get; set; }
    public string EventImage { get; set; }  // thêm trường ảnh
}
