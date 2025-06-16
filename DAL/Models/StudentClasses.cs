using DAL.Models;

public class StudentClasses
{
    public int Id { get; set; }

    public int? StudentId { get; set; }

    public int? ClassId { get; set; }

    // Navigation
    public virtual Students Student { get; set; }
    public virtual Classes Class { get; set; }
}
