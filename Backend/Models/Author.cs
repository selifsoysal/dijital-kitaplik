using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations; //tarih dönüşümü

namespace lesson_3.Models
{
    public class Author
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string? Bio { get; set; }
    public string? ProfileImagePath { get; set; }

    [JsonIgnore]
    public virtual List<Book> Books { get; set; } = new();
}

}