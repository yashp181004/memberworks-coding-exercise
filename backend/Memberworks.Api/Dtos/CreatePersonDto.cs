using System.ComponentModel.DataAnnotations;
using Memberworks.Api.Models;

namespace Memberworks.Api.Dtos
{
    public class CreatePersonDto
    {
        [Required, MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;
        [Required, MaxLength(100)]
        public string LastName { get; set; } = string.Empty;
        [Required, EmailAddress, MaxLength(200)]
        public string Email { get; set; } = string.Empty;
        [Required]
        public Role Role { get; set; }
    }
}
