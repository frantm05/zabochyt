namespace Zabochyt.Server.Models
{
    public class TimeSlot
    {
        public int Id { get; set; }

        public int LocationId { get; set; }
        public Location Location { get; set; } = null!;

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        public int Capacity { get; set; }
        public bool IsOpen { get; set; } = true;

        public ICollection<Registration> Registrations { get; set; } = new List<Registration>();
    }

}
