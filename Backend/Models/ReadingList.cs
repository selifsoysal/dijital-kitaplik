using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;


namespace lesson_3.Models
{
    public class ReadingList
    {
        public int Id { get; set; }
        public required string Name { get; set; }

        public int UserId { get; set; }
        public virtual User User { get; set; }

        public virtual List<Book> Books { get; set; } = new();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }

}