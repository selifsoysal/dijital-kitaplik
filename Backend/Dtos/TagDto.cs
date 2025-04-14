using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace lesson_3.Dtos
{
    public class TagDto
    {
        [Required(ErrorMessage = "Isim Alani Gereklidir")]
        public required string Name { get; set; }

    }
}