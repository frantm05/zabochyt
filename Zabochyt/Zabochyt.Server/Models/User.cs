using System.ComponentModel.DataAnnotations;

namespace Zabochyt.Server.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Nickname { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string Role { get; set; } = "dobrovolnik";
        public string? AvatarColor { get; set; } = "#2e7d32"; // Defaultní zelená

        public ICollection<Registration> Registrations { get; set; } = new List<Registration>();
    }
}