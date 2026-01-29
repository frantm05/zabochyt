namespace Zabochyt.Server.Models
{
    public class TimeSlot
    {
        public int Id { get; set; }

        public string Location { get; set; } = string.Empty;

        // Frontend posílá "note", Controller čeká "Note"
        public string? Note { get; set; }

        // Controller používá "Start" a "End"
        public DateTime Start { get; set; }
        public DateTime End { get; set; }

        // Controller používá "MaxCapacity"
        public int MaxCapacity { get; set; }

        public bool IsOpen { get; set; } = true;

        public ICollection<Registration> Registrations { get; set; } = new List<Registration>();
    }
}