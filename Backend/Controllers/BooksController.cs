using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using lesson_3.Dtos;
using lesson_3.Models;
using lesson_3.Services;
using System.IO;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

namespace lesson_3.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public BooksController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult GetAllBooks()
        {
            var books = _dbContext.Books
                          .Include(b => b.Category)
                          .Include(b => b.Tags)
                          .Include(b => b.Author)
                          .ToList();

            return Ok(books);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetBookById(int id)
        {
            var book = _dbContext.Books.Include(b => b.Category)
                                        .Include(b => b.Tags)
                                        .Include(b => b.Author)
                                        .FirstOrDefault(b => b.Id == id);
            if (book == null)
                return NotFound();
            return Ok(book);
        }

        [HttpGet("author/{authorId:int}")]
        public IActionResult GetBooksByAuthor(int authorId)
        {
            var books = _dbContext.Books
                            .Include(b => b.Category)
                            .Include(b => b.Tags)
                            .Include(b => b.Author)
                            .Where(b => b.AuthorId == authorId)
                            .ToList();

            if (books == null || books.Count == 0)
                return NotFound($"No books found for author with ID {authorId}.");

            return Ok(books);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBook([FromForm] BookDto bookDto)
        {
            string? filePath = null;

            if (bookDto.CoverImagePath != null)
            {
                var fileName = Path.GetFileName(bookDto.CoverImagePath.FileName);
                var fileDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                var fileFullPath = Path.Combine(fileDirectory, fileName);

                if (!Directory.Exists(fileDirectory))
                {
                    Directory.CreateDirectory(fileDirectory);
                }

                using (var stream = new FileStream(fileFullPath, FileMode.Create))
                {
                    await bookDto.CoverImagePath.CopyToAsync(stream);
                }

                filePath = Path.Combine("uploads", fileName);
            }

            var book = new Book
            {
                Title = bookDto.Title,
                PageCount = bookDto.PageCount,
                Description = bookDto.Description,
                CoverImagePath = filePath,
                CategoryId = bookDto.CategoryId,
                AuthorId = bookDto.AuthorId
            };

            var tags = _dbContext.Tags.Where(t => bookDto.TagIds.Contains(t.Id)).ToList();
            book.Tags = tags;

            _dbContext.Books.Add(book);
            await _dbContext.SaveChangesAsync();

            return Ok(book);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateBook(int id, [FromForm] BookDto bookDto)
        {
            var book = await _dbContext.Books.Include(b => b.Tags).FirstOrDefaultAsync(b => b.Id == id);
            if (book == null)
                return NotFound();

            if (bookDto.CoverImagePath != null)
            {
                var fileName = Path.GetFileName(bookDto.CoverImagePath.FileName);
                var fileDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                var fileFullPath = Path.Combine(fileDirectory, fileName);

                if (!Directory.Exists(fileDirectory))
                {
                    Directory.CreateDirectory(fileDirectory);
                }

                using (var stream = new FileStream(fileFullPath, FileMode.Create))
                {
                    await bookDto.CoverImagePath.CopyToAsync(stream);
                }

                if (!string.IsNullOrEmpty(book.CoverImagePath))
                {
                    var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", book.CoverImagePath);
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

                book.CoverImagePath = Path.Combine("uploads", fileName);
            }

            var tags = new List<Tag>();
            foreach (var tagId in bookDto.TagIds)
            {
                var existingTag = await _dbContext.Tags.FirstOrDefaultAsync(t => t.Id == tagId);
                if (existingTag != null)
                {
                    tags.Add(existingTag);
                }
                else
                {
                    var newTag = new Tag { Id = tagId, Name = "Unknown" };
                    tags.Add(newTag);
                    _dbContext.Tags.Add(newTag);
                }
            }
            book.Tags = tags;

            book.Title = bookDto.Title;
            book.PageCount = bookDto.PageCount;
            book.Description = bookDto.Description;
            book.CategoryId = bookDto.CategoryId;
            book.AuthorId = bookDto.AuthorId;

            _dbContext.Books.Update(book);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public IActionResult DeleteBook(int id)
        {
            var book = _dbContext.Books.Find(id);
            if (book == null)
                return NotFound();

            _dbContext.Books.Remove(book);
            _dbContext.SaveChanges();

            return NoContent();
        }
    }
}
