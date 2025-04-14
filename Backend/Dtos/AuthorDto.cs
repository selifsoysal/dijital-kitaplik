using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace lesson_3.Dtos
{
    public class AuthorDto
    {
        [Required(ErrorMessage = "Isim Alani Gereklidir")]
        public string Name { get; set; }
        public string? Bio { get; set; }
//        public DateTime? BirthDate { get; set; }
        public IFormFile? ProfileImage { get; set; }
    }
}
