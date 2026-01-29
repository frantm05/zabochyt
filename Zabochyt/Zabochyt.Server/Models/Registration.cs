namespace Zabochyt.Server.Models;

public class Registration
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int TimeSlotId { get; set; }
    public TimeSlot TimeSlot { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
