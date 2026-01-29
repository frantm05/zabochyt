namespace Zabochyt.Server.Models
{
    public class TimeSlot
    {
        public int Id { get; set; }

        public string Location { get; set; }
        public string Description  { get; set; }

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        public int Capacity { get; set; }
        public bool IsOpen { get; set; } = true;

        public ICollection<Registration> Registrations { get; set; } = new List<Registration>();
    }

}
