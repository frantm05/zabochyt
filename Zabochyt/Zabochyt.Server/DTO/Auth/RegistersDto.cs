namespace Zabochyt.Server.DTO.Auth
{
    public class RegisterDto
    {
        // Původně Name, teď Nickname (aby to sedělo s modelem)
        public string Nickname { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        // Přidáme chybějící telefon
        public string Phone { get; set; } = string.Empty;
    }
}