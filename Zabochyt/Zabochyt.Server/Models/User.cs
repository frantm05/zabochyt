using System.ComponentModel.DataAnnotations;

namespace Zabochyt.Server.Models
{
    public enum UserRole
    {
        Admin,
        Volunteer // V kódu používáme spíše řetězce "koordinator" / "dobrovolnik", ale enum se hodí
    }

    public class User
    {
        public int Id { get; set; }

        public string Nickname { get; set; } = string.Empty; // Původně Name -> Nickname
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;

        // Nové pole pro telefon
        public string? Phone { get; set; }

        // Role uchováváme jako string pro jednoduchost s JWT claims, 
        // nebo můžeš použít Enum a konverzi. Pro teď necháme string, aby to sedělo s AuthControllerem.
        public string Role { get; set; } = "dobrovolnik";

        public ICollection<Registration> Registrations { get; set; } = new List<Registration>();
    }
}