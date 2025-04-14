using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace lesson_3.Dtos
{
    public class BookDto
    {
        [Required(ErrorMessage = "Title is required")]
        public required string Title { get; set; }

        [Required(ErrorMessage = "AuthorId is required")]
        public required int AuthorId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Page count must be greater than 0")]
        public int PageCount { get; set; }

        [Required]
        public required int CategoryId { get; set; }

        public string? Description { get; set; }

        public IFormFile? CoverImagePath { get; set; }
        public List<int> TagIds { get; set; }
    }
}
