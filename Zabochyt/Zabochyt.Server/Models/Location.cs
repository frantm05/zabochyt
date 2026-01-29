namespace Zabochyt.Server.Models
{
    public class Location
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }

        public ICollection<TimeSlot> TimeSlots { get; set; } = new List<TimeSlot>();
    }

}
