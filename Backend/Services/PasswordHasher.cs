using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace lesson_3.Services
{
    public class PasswordHasher
    {
        public static string HashPassword(string Password)
        {

            byte[] bytes = Encoding.UTF8.GetBytes(Password);
            string hashedPassword = string.Empty;
            using (SHA256 hashstring = SHA256.Create())
            {
                byte[] hash = hashstring.ComputeHash(bytes);
                foreach (byte x in hash)
                {
                    hashedPassword += String.Format("{0:x2}", x);
                }
            }
            return hashedPassword;
        }
    }
}