namespace Memberworks.Api.Models
{
    public class ProgramAssignment
    {
        public int PersonId { get; set; }
        public Person Person { get; set; } = null!;

        public int ProgramEntityId { get; set; }
        public ProgramEntity ProgramEntity { get; set; } = null!;
    }
}
