using System.ComponentModel.DataAnnotations;

namespace Memberworks.Api.Models
{
    public enum Role
    {
        Admin,
        Member,
        Coach
    }

    public class Person
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required, EmailAddress, MaxLength(200)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public Role Role { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<ProgramAssignment> ProgramAssignments { get; set; } = new List<ProgramAssignment>();
    }
}
