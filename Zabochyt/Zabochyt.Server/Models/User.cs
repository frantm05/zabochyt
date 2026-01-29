namespace Zabochyt.Server.Models
{
    public enum UserRole
    {
        Admin,
        Volunteer
    }

    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public UserRole Role { get; set; }

        public ICollection<Registration> Registrations { get; set; } = new List<Registration>();
    }

}
