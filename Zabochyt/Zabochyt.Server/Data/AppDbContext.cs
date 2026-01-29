using System.Collections.Generic;
using System.Reflection.Emit;
using Zabochyt.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Zabochyt.Server.Data
{

    public class AppDbContext : DbContext
    {
        public DbSet<User> Users => Set<User>();
        public DbSet<TimeSlot> TimeSlots => Set<TimeSlot>();
        public DbSet<Registration> Registrations => Set<Registration>();

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Registration>()
                .HasIndex(r => new { r.UserId, r.TimeSlotId })
                .IsUnique(); // 1 uživatel = 1 přihláška
        }
    }

}

