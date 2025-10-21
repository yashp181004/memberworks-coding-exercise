using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Memberworks.Api.Data;
using Memberworks.Api.Dtos;
using Memberworks.Api.Models;

namespace Memberworks.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProgramsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ProgramsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var programs = await _db.Programs
                .Include(p => p.ProgramAssignments)
                .Select(p => new ProgramDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                    AssignedPersonIds = p.ProgramAssignments.Select(pa => pa.PersonId).ToList()
                })
                .ToListAsync();

            return Ok(programs);
        }

        [HttpGet("{id}", Name="GetProgram")]
        public async Task<IActionResult> GetById(int id)
        {
            var program = await _db.Programs
                .Include(p => p.ProgramAssignments)
                .ThenInclude(pa => pa.Person)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (program == null) return NotFound();

            return Ok(new ProgramDto
            {
                Id = program.Id,
                Name = program.Name,
                Description = program.Description,
                StartDate = program.StartDate,
                EndDate = program.EndDate,
                AssignedPersonIds = program.ProgramAssignments.Select(pa => pa.PersonId).ToList()
            });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProgramDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (dto.EndDate < dto.StartDate) return BadRequest(new { message = "EndDate must be >= StartDate" });

            var program = new ProgramEntity
            {
                Name = dto.Name,
                Description = dto.Description,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate
            };

            _db.Programs.Add(program);
            await _db.SaveChangesAsync();

            return CreatedAtRoute("GetProgram", new { id = program.Id }, program);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateProgramDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (dto.EndDate < dto.StartDate) return BadRequest(new { message = "EndDate must be >= StartDate" });

            var program = await _db.Programs.FindAsync(id);
            if (program == null) return NotFound();

            program.Name = dto.Name;
            program.Description = dto.Description;
            program.StartDate = dto.StartDate;
            program.EndDate = dto.EndDate;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var program = await _db.Programs.FindAsync(id);
            if (program == null) return NotFound();

            var assignments = _db.ProgramAssignments.Where(pa => pa.ProgramEntityId == id);
            _db.ProgramAssignments.RemoveRange(assignments);

            _db.Programs.Remove(program);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{programId}/assign")]
        public async Task<IActionResult> AssignPeople(int programId, [FromBody] int[] personIds)
        {
            var program = await _db.Programs.FindAsync(programId);
            if (program == null) return NotFound();

            var existingPeople = await _db.People.Where(p => personIds.Contains(p.Id)).Select(p => p.Id).ToListAsync();
            var missing = personIds.Except(existingPeople).ToList();
            if (missing.Any()) return BadRequest(new { message = $"People not found: {string.Join(',', missing)}" });

            foreach (var pid in personIds.Distinct())
            {
                var already = await _db.ProgramAssignments.AnyAsync(pa => pa.ProgramEntityId == programId && pa.PersonId == pid);
                if (!already)
                {
                    _db.ProgramAssignments.Add(new ProgramAssignment { PersonId = pid, ProgramEntityId = programId });
                }
            }
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{programId}/remove/{personId}")]
        public async Task<IActionResult> Remove(int programId, int personId)
        {
            var pa = await _db.ProgramAssignments.FindAsync(personId, programId);
            if (pa == null) return NotFound();

            _db.ProgramAssignments.Remove(pa);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
