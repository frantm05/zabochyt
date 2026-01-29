using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Zabochyt.Server.Data;
using Zabochyt.Server.Models;

namespace Zabochyt.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Důležité: Vyžaduje přihlášení
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/users/profile
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            // 1. Získání ID z tokenu (bezpečnější metoda)
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                         ?? User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("Nelze identifikovat uživatele z tokenu.");
            }

            // 2. Načtení uživatele z DB
            // Předpokládám, že Id je int. Pokud je string/Guid, odstraň int.Parse
            if (!int.TryParse(userId, out int id)) return BadRequest("Špatný formát ID.");

            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound("Uživatel nenalezen.");
            }

            // 3. Odeslání dat ve formátu, který čeká frontend
            // (Včetně statistik - zatím natvrdo nebo dopočítané)
            var response = new
            {
                email = user.Email,
                nickname = user.Nickname,
                phone = user.Phone,
                avatarColor = "#2e7d32", // Pokud nemáš v DB, pošleme default
                shiftsCompleted = 0,     // TODO: Dopočítat z DB
                totalHours = 0           // TODO: Dopočítat z DB
            };

            return Ok(response);
        }

        // PUT: api/users/profile (Uložení změn)
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userId, out int id)) return BadRequest();

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            // Aktualizace polí
            user.Nickname = dto.Nickname;
            user.Phone = dto.Phone;
            // AvatarColor tu zatím asi nemáš v modelu User, tak ho ignorujeme nebo přidej do DB

            await _context.SaveChangesAsync();
            return Ok(new { message = "Profil aktualizován" });
        }
    }

    // Pomocná třída pro data z frontendu
    public class UpdateProfileDto
    {
        public string Nickname { get; set; }
        public string Phone { get; set; }
        public string AvatarColor { get; set; }
    }
}