using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using lesson_3.Dtos;
using lesson_3.Models;
using lesson_3.Services;


namespace lesson_3.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public CategoriesController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult GetAllCategories()
        {
            var categories = _dbContext.Categories.ToList();
            return Ok(categories);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetCategoryById(int id)
        {
            var category = _dbContext.Categories.Find(id);
            if (category == null)
                return NotFound();
            return Ok(category);
        }

        [HttpPost]
        public IActionResult CreateCategory(CategoryDto dto)
        {
            var category = new Category
            {
                Name = dto.Name
            };

            _dbContext.Categories.Add(category);
            _dbContext.SaveChanges();
            return Ok(category);
        }

        [HttpPut("{id:int}")]
        public IActionResult UpdateCategory(int id, CategoryDto dto)
        {
            var category = _dbContext.Categories.Find(id);
            if (category == null)
                return NotFound();

            category.Name = dto.Name;
            _dbContext.SaveChanges();
            return Ok(category);
        }

        [HttpDelete("{id:int}")]
        public IActionResult DeleteCategory(int id)
        {
            var category = _dbContext.Categories.Find(id);
            if (category == null)
                return NotFound();

            _dbContext.Categories.Remove(category);
            _dbContext.SaveChanges();
            return Ok(category);
        }
    }
}
