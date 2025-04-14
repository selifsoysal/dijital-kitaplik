using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace lesson_3.Dtos
{
    public class AddBookRequestDto
    {
         public List<int> BookIds { get; set; }
    }
}
