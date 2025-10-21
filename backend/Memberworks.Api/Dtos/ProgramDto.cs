namespace Memberworks.Api.Dtos
{
    public class ProgramDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public List<int> AssignedPersonIds { get; set; } = new List<int>();
    }
}
