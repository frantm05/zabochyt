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
    public class TimeSlotsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TimeSlotsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/timeslots
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TimeSlot>>> GetTimeSlots()
        {
            // DŮLEŽITÉ: Include(t => t.Registrations) načte i přihlášky!
            // Include(r => r.User) načte jména lidí pro admina
            return await _context.TimeSlots
                .Include(t => t.Registrations)
                .ThenInclude(r => r.User)
                .OrderBy(t => t.Start)
                .ToListAsync();
        }

        // POST: api/timeslots (Vytvoření směny - jen pro adminy/koordinátory)
        [HttpPost]
        [Authorize] // Přidej Role="koordinator" pokud máš role
        public async Task<ActionResult<TimeSlot>> PostTimeSlot(TimeSlot timeSlot)
        {
            _context.TimeSlots.Add(timeSlot);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetTimeSlots", new { id = timeSlot.Id }, timeSlot);
        }

        // DELETE: api/timeslots/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteTimeSlot(int id)
        {
            var timeSlot = await _context.TimeSlots.FindAsync(id);
            if (timeSlot == null) return NotFound();

            _context.TimeSlots.Remove(timeSlot);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/timeslots/5/signup (Přihlášení na směnu)
        [HttpPost("{id}/signup")]
        [Authorize]
        public async Task<IActionResult> SignUp(int id)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out int userId)) return BadRequest("Invalid Token");

            var slot = await _context.TimeSlots.Include(t => t.Registrations).FirstOrDefaultAsync(t => t.Id == id);
            if (slot == null) return NotFound();

            // Kontrola kapacity
            if (slot.Registrations.Count >= slot.MaxCapacity)
                return BadRequest("Směna je již plná.");

            // Kontrola duplicity
            if (slot.Registrations.Any(r => r.UserId == userId))
                return BadRequest("Už jsi přihlášen.");

            // Vytvoření registrace
            var registration = new Registration
            {
                TimeSlotId = id,
                UserId = userId,
                RegisteredAt = DateTime.UtcNow
            };

            _context.Registrations.Add(registration);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Přihlášeno" });
        }

        // POST: api/timeslots/5/signoff (Odhlášení)
        [HttpPost("{id}/signoff")]
        [Authorize]
        public async Task<IActionResult> SignOff(int id)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out int userId)) return BadRequest();

            var registration = await _context.Registrations
                .FirstOrDefaultAsync(r => r.TimeSlotId == id && r.UserId == userId);

            if (registration == null) return NotFound("Nejsi přihlášen na tuto směnu.");

            _context.Registrations.Remove(registration);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Odhlášeno" });
        }

        // GET: api/timeslots/my (Moje směny)
        [HttpGet("my")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<TimeSlot>>> GetMyShifts()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out int userId)) return BadRequest();

            // Vybere směny, kde je uživatel v seznamu registrací
            var myShifts = await _context.TimeSlots
                .Include(t => t.Registrations)
                .Where(t => t.Registrations.Any(r => r.UserId == userId))
                .OrderBy(t => t.Start)
                .ToListAsync();

            return myShifts;
        }
    }
}