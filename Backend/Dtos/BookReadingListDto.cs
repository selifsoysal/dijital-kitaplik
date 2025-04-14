using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace lesson_3.Dtos
{
    public class BookReadingListDto
    {
        [Required(ErrorMessage = "ReadingList ID is required")]
        public int ReadingListId { get; set; }

        [Required(ErrorMessage = "Book ID is required")]
        public int BookId { get; set; }
    }
}