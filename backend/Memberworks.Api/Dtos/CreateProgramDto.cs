using System.ComponentModel.DataAnnotations;

namespace Memberworks.Api.Dtos
{
    public class CreateProgramDto
    {
        [Required, MaxLength(200)]
        public string Name { get; set; } = string.Empty;
        [MaxLength(1000)]
        public string? Description { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
    }
}
