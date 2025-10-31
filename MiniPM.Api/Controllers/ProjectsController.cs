using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniPM.Api.Data;
using MiniPM.Api.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace MiniPM.Api.Controllers
{
    [ApiController]
    [Route("api/projects")]
    [Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ProjectsController(AppDbContext db)
        {
            _db = db;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub));

        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            var userId = GetUserId();
            var projects = await _db.Projects
                .Where(p => p.UserId == userId)
                .Select(p => new ProjectDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    CreatedAt = p.CreatedAt,
                    Tasks = p.Tasks.Select(t => new DTOs.TaskDto { Id = t.Id, Title = t.Title, DueDate = t.DueDate, IsCompleted = t.IsCompleted, ProjectId = t.ProjectId })
                }).ToListAsync();

            return Ok(projects);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProject([FromBody] ProjectCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = GetUserId();
            var p = new MiniPM.Api.Models.Project { Title = dto.Title, Description = dto.Description, UserId = userId };
            _db.Projects.Add(p);
            await _db.SaveChangesAsync();
            return Ok(new { p.Id });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProject(int id)
        {
            var userId = GetUserId();
            var p = await _db.Projects.Include(x => x.Tasks).FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
            if (p == null) return NotFound();

            var dto = new ProjectDto { Id = p.Id, Title = p.Title, Description = p.Description, CreatedAt = p.CreatedAt, Tasks = p.Tasks.Select(t => new DTOs.TaskDto { Id = t.Id, Title = t.Title, DueDate = t.DueDate, IsCompleted = t.IsCompleted, ProjectId = t.ProjectId }) };
            return Ok(dto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var userId = GetUserId();
            var p = await _db.Projects.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
            if (p == null) return NotFound();

            _db.Projects.Remove(p);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}

