namespace Zabochyt.Server.Models;

public class Registration
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int TimeSlotId { get; set; }
    public TimeSlot TimeSlot { get; set; } = null!;

    // Controller používá RegisteredAt
    public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
}