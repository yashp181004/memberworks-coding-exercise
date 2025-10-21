using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Memberworks.Api.Data;
using Memberworks.Api.Models;
using Memberworks.Api.Dtos;

namespace Memberworks.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PeopleController : ControllerBase
    {
        private readonly AppDbContext _db;

        public PeopleController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var people = await _db.People
                                  .OrderByDescending(p => p.CreatedAt)
                                  .Select(p => new PersonDto {
                                      Id = p.Id,
                                      FirstName = p.FirstName,
                                      LastName = p.LastName,
                                      Email = p.Email,
                                      Role = p.Role,
                                      CreatedAt = p.CreatedAt
                                  })
                                  .ToListAsync();
            return Ok(people);
        }

        [HttpGet("{id}", Name="GetPerson")]
        public async Task<IActionResult> GetById(int id)
        {
            var person = await _db.People.FindAsync(id);
            if (person == null) return NotFound();
            return Ok(person);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePersonDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var exists = await _db.People.AnyAsync(p => p.Email == dto.Email);
            if (exists)
                return Conflict(new { message = "Email already exists." });

            var person = new Person
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Role = dto.Role
            };

            _db.People.Add(person);
            await _db.SaveChangesAsync();

            return CreatedAtRoute("GetPerson", new { id = person.Id }, person);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreatePersonDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var person = await _db.People.FindAsync(id);
            if (person == null) return NotFound();

            if (person.Email != dto.Email)
            {
                var exists = await _db.People.AnyAsync(p => p.Email == dto.Email && p.Id != id);
                if (exists) return Conflict(new { message = "Email already exists." });
            }

            person.FirstName = dto.FirstName;
            person.LastName = dto.LastName;
            person.Email = dto.Email;
            person.Role = dto.Role;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var person = await _db.People.FindAsync(id);
            if (person == null) return NotFound();

            var assignments = _db.ProgramAssignments.Where(pa => pa.PersonId == id);
            _db.ProgramAssignments.RemoveRange(assignments);

            _db.People.Remove(person);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}
