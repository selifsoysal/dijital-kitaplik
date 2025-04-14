using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace lesson_3.Models
{
    public class User
    {
        public int Id { get; set; }

        public required string Username { get; set; }
        public required string Password { get; set; }
        public required bool IsAdmin { get; set; }

        [JsonIgnore]
        public virtual List<ReadingList> ReadingLists { get; set; } = new();
    }
}