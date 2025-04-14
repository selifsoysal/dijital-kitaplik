using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using lesson_3.Dtos;
using lesson_3.Models;
using lesson_3.Services;
using System.Linq;

namespace lesson_3.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReadingListsController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public ReadingListsController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult GetAllReadingLists()
        {
            var readingLists = _dbContext.ReadingLists
                .Include(rl => rl.User)
                .Include(rl => rl.Books)
                    .ThenInclude(b => b.Category)
                .Include(rl => rl.Books)
                    .ThenInclude(b => b.Author)
                .ToList();

            var readingListDtos = readingLists.Select(rl => new
            {
                rl.Id,
                rl.Name,
                rl.UserId,
                UserName = rl.User?.Username ?? "Unknown User",
                Books = rl.Books.Select(b => new
                {
                    b.Id,
                    b.Title,
                    b.CoverImagePath,
                    AuthorName = b.Author?.Name ?? "Unknown Author"
                }).ToList()
            });

            return Ok(readingListDtos);
        }

        [HttpGet("user/{userId}")]
        public IActionResult GetUserReadingLists(int userId)
        {
            var userReadingLists = _dbContext.ReadingLists
                .Include(rl => rl.Books)
                    .ThenInclude(b => b.Author)
                .Where(rl => rl.UserId == userId)
                .ToList();

            if (!userReadingLists.Any())
                return NotFound($"No reading lists found for user with ID {userId}.");

            var readingListDtos = userReadingLists.Select(rl => new
            {
                rl.Id,
                rl.Name,
                rl.UserId,
                Books = rl.Books.Select(b => new
                {
                    b.Id,
                    b.Title,
                    b.CoverImagePath,
                    AuthorName = b.Author?.Name ?? "Unknown Author"
                }).ToList()
            });

            return Ok(readingListDtos);
        }

        [HttpPost("user/{userId}/reading-list/{listId}/add-book")]
        public IActionResult AddBookToUserReadingList(int userId, int listId, [FromBody] AddBookRequestDto dto)
        {
            var readingList = _dbContext.ReadingLists
                .Include(rl => rl.Books)
                .FirstOrDefault(rl => rl.UserId == userId && rl.Id == listId);

            if (readingList == null)
                return NotFound("Reading list not found.");

            foreach (var bookId in dto.BookIds)
            {
                var book = _dbContext.Books.Find(bookId);
                if (book == null)
                    return NotFound($"Book with ID {bookId} not found.");

                if (readingList.Books.Any(b => b.Id == bookId))
                {
                    continue;
                }

                readingList.Books.Add(book);
            }

            _dbContext.SaveChanges();

            var readingListDto = new
            {
                readingList.Id,
                readingList.Name,
                readingList.UserId,
                Books = readingList.Books.Select(b => new
                {
                    b.Id,
                    b.Title,
                    b.CoverImagePath,
                    AuthorName = b.Author?.Name ?? "Unknown Author"
                }).ToList()
            };

            return Ok(readingListDto);
        }

        [HttpDelete("user/{userId}/reading-list/{listId}/remove-book/{bookId}")]
        public IActionResult RemoveBookFromReadingList(int userId, int listId, int bookId)
        {
            var readingList = _dbContext.ReadingLists
                .Include(rl => rl.Books)
                .FirstOrDefault(rl => rl.UserId == userId && rl.Id == listId);

            if (readingList == null)
                return NotFound($"Reading list not found.");

            var book = readingList.Books.FirstOrDefault(b => b.Id == bookId);
            if (book == null)
                return NotFound($"Book with ID {bookId} not found in the reading list.");

            readingList.Books.Remove(book);
            _dbContext.SaveChanges();

            return Ok(new { Message = "Book removed successfully." });
        }

        [HttpDelete("user/{userId}/reading-list/{listId}")]
        public IActionResult DeleteReadingList(int userId, int listId)
        {
            var readingList = _dbContext.ReadingLists.FirstOrDefault(rl => rl.UserId == userId && rl.Id == listId);

            if (readingList == null)
                return NotFound($"Reading list not found.");

            _dbContext.ReadingLists.Remove(readingList);
            _dbContext.SaveChanges();

            return Ok(new { Message = "Reading list deleted successfully." });
        }


        [HttpPost("user/{userId}/create-reading-list")]
        public IActionResult CreateReadingList(int userId, [FromBody] ReadingListDto dto)
        {
            if (userId != dto.UserId)
                return BadRequest("User ID mismatch.");

            var readingList = new ReadingList
            {
                Name = dto.Name,
                UserId = dto.UserId,
                CreatedAt = DateTime.UtcNow
            };

            foreach (var bookId in dto.BookIds ?? Enumerable.Empty<int>())
            {
                var book = _dbContext.Books.Find(bookId);
                if (book != null)
                    readingList.Books.Add(book);
            }

            _dbContext.ReadingLists.Add(readingList);
            _dbContext.SaveChanges();

            return Ok(new
            {
                readingList.Id,
                readingList.Name,
                readingList.UserId,
                readingList.CreatedAt
            });
        }
    }
}
