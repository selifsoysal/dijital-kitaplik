using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace lesson_3.Models
{
    public class Tag
    {
        public int Id { get; set; }
        public required string Name { get; set; }

        [JsonIgnore]
        public virtual List<Book> Books { get; set; } = new();
    }
}