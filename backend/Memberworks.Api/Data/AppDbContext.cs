using Microsoft.EntityFrameworkCore;
using Memberworks.Api.Models;

namespace Memberworks.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Person> People { get; set; } = null!;
        public DbSet<ProgramEntity> Programs { get; set; } = null!;
        public DbSet<ProgramAssignment> ProgramAssignments { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ProgramAssignment>()
                .HasKey(pa => new { pa.PersonId, pa.ProgramEntityId });

            modelBuilder.Entity<ProgramAssignment>()
                .HasOne(pa => pa.Person)
                .WithMany(p => p.ProgramAssignments)
                .HasForeignKey(pa => pa.PersonId);

            modelBuilder.Entity<ProgramAssignment>()
                .HasOne(pa => pa.ProgramEntity)
                .WithMany(p => p.ProgramAssignments)
                .HasForeignKey(pa => pa.ProgramEntityId);
        }
    }
}
