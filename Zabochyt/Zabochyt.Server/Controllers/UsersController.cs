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
            // 1. Získání ID z tokenu
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                         ?? User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int id))
            {
                return BadRequest("Nelze identifikovat uživatele.");
            }

            // 2. Načtení uživatele VČETNĚ historie směn
            // Používáme Include, abychom měli přístup k datům pro výpočet
            var user = await _context.Users
                .Include(u => u.Registrations)
                .ThenInclude(r => r.TimeSlot)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound("Uživatel nenalezen.");
            }

            // 3. Výpočet statistik (Logika)
            // Zajímá nás jen to, co už proběhlo (konec směny je v minulosti)
            var completedShifts = user.Registrations
                .Where(r => r.TimeSlot.End < DateTime.UtcNow) // Nebo DateTime.Now podle nastavení serveru
                .Select(r => r.TimeSlot)
                .ToList();

            int shiftsCount = completedShifts.Count;

            // Sečteme délku všech směn (TotalHours vrací double, zaokrouhlíme na 1 desetinné místo)
            double totalHours = Math.Round(completedShifts.Sum(s => (s.End - s.Start).TotalHours), 1);

            // 4. Odeslání dat
            var response = new
            {
                email = user.Email,
                nickname = user.Nickname,
                phone = user.Phone,
                avatarColor = user.AvatarColor,

                // Zde posíláme vypočtené hodnoty
                shiftsCompleted = shiftsCount,
                totalHours = totalHours
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

            if (!string.IsNullOrEmpty(dto.AvatarColor))
            {
                user.AvatarColor = dto.AvatarColor;
            }

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