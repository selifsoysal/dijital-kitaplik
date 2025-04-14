using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using lesson_3.Dtos;
using lesson_3.Models;
using lesson_3.Services;
using System.IO;
using System.Threading.Tasks;

namespace lesson_3.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthorsController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public AuthorsController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAuthors()
        {
            var authors = await _dbContext.Authors.ToListAsync();
            return Ok(authors);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetAuthorById(int id)
        {
            var author = await _dbContext.Authors.FindAsync(id);
            if (author == null)
                return NotFound(new { message = "Author not found" });

            return Ok(author);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAuthor([FromForm] AuthorDto authorDto)
        {
            if (authorDto == null)
                return BadRequest(new { message = "Invalid author data" });

            string profileImagePath = null;

            if (authorDto.ProfileImage != null)
            {
                var fileName = Path.GetFileName(authorDto.ProfileImage.FileName);
                var fileDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                var fileFullPath = Path.Combine(fileDirectory, fileName);

                if (!Directory.Exists(fileDirectory))
                {
                    Directory.CreateDirectory(fileDirectory);
                }

                using (var stream = new FileStream(fileFullPath, FileMode.Create))
                {
                    await authorDto.ProfileImage.CopyToAsync(stream);
                }

                profileImagePath = Path.Combine("uploads", fileName).Replace("\\", "/");
            }

            var author = new Author
            {
                Name = authorDto.Name,
                Bio = authorDto.Bio,
                ProfileImagePath = profileImagePath
            };

            _dbContext.Authors.Add(author);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAuthorById), new { id = author.Id }, author);
        }

        [HttpGet("{id}/books")]
        public async Task<IActionResult> GetAuthorBooks(int id)
        {
            var books = await _dbContext.Books
                                        .Where(b => b.AuthorId == id)
                                        .ToListAsync();

            if (books == null || !books.Any())
                return NotFound(new { message = "No books found for this author" });

            return Ok(books);
        }
    }
}
