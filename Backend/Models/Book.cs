using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;


namespace lesson_3.Models
{
    public class Book
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public int PageCount { get; set; }

        public int CategoryId { get; set; }
        public virtual Category Category { get; set; }

        public string? CoverImagePath { get; set; }

        public string Description { get; set; }

        public virtual List<Tag> Tags { get; set; } = new();

        public int AuthorId { get; set; }
        public Author Author { get; set; }

        public virtual List<ReadingList> ReadingLists { get; set; } = new();

    }
}