using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Zabochyt.Server.Data;
using Zabochyt.Server.DTO.Auth;
using Zabochyt.Server.Models;

namespace Zabochyt.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(RegisterDto dto)
        {
            // 1. Vytvoření uživatele
            // POZOR: Heslo by se mělo hashovat! Pro demo ukládáme jako plain text (nebezpečné pro produkci).
            // V reálu použij: BCrypt.Net.BCrypt.HashPassword(dto.Password)

            var user = new User
            {
                Email = dto.Email,
                Nickname = dto.Nickname, // Oprava: Name -> Nickname
                PasswordHash = dto.Password,
                Phone = dto.Phone,       // Oprava: Přidán telefon
                Role = "dobrovolnik"     // Oprava: Enum -> string
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registrace úspěšná" });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
        {
            // 1. Hledání uživatele podle emailu
            var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);

            // 2. Ověření hesla (zde porovnáváme plain text, v reálu VerifyHash)
            if (user == null || user.PasswordHash != dto.Password)
            {
                return BadRequest("Neplatný email nebo heslo.");
            }

            // 3. Vytvoření JWT Tokenu
            string token = CreateToken(user);

            return Ok(new AuthResponseDto { Token = token });
        }

        private string CreateToken(User user)
        {
            // Získání tajného klíče z konfigurace
            var secretKey = _configuration.GetSection("AppSettings:Token").Value;
            if (string.IsNullOrEmpty(secretKey)) secretKey = "SuperTajnyKlicProZabochytKteryMusiBytDlouhyAProtoHoTedJesteProdlouziimeAbyMelDostBitu123";
            // Vytvoření Claims (údaje v tokenu)
            List<Claim> claims = new List<Claim>
            {
                // Důležité: ID uživatele posíláme jako NameIdentifier
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Nickname), // Oprava: Name -> Nickname
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)      // Role je teď string
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}