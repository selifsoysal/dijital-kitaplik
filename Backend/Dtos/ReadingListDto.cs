using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace lesson_3.Dtos
{
    public class ReadingListDto
    {
        [Required(ErrorMessage = "Name is required")]
        public required string Name { get; set; }

        [Required]
        public required int UserId { get; set; }

         public List<int> BookIds { get; set; }

    }

}