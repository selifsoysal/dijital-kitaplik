using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace lesson_3.Dtos
{
    public class LoginDto
    {

        [Required(ErrorMessage = "Kullanıcı adı gereklidir")]
        public required string Username { get; set; }

        [Required(ErrorMessage = "Şifre alanı gereklidir")]
        public required string Password { get; set; }
    }
}