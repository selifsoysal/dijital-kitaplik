using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using lesson_3.Dtos;
using lesson_3.Models;
using lesson_3.Services;


namespace lesson_3.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TagsController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public TagsController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult GetAllTags()
        {
            var tags = _dbContext.Tags.ToList();
            return Ok(tags);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetTagById(int id)
        {
            var tag = _dbContext.Tags.Find(id);
            if (tag == null)
                return NotFound();
            return Ok(tag);
        }

        [HttpPost]
        public IActionResult CreateTag(TagDto dto)
        {
            var tag = new Tag
            {
                Name = dto.Name
            };

            _dbContext.Tags.Add(tag);
            _dbContext.SaveChanges();
            return Ok(tag);
        }

        [HttpPut("{id:int}")]
        public IActionResult UpdateTag(int id, TagDto dto)
        {
            var tag = _dbContext.Tags.Find(id);
            if (tag == null)
                return NotFound();

            tag.Name = dto.Name;
            _dbContext.SaveChanges();
            return Ok(tag);
        }

        [HttpDelete("{id:int}")]
        public IActionResult DeleteTag(int id)
        {
            var tag = _dbContext.Tags.Find(id);
            if (tag == null)
                return NotFound();

            _dbContext.Tags.Remove(tag);
            _dbContext.SaveChanges();
            return Ok(tag);
        }
    }
}
