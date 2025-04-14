using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using lesson_3.Models;
using Microsoft.EntityFrameworkCore;

namespace lesson_3.Services
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {

        }

        public required DbSet<User> Users { get; set; }
        public required DbSet<Book> Books { get; set; }
        public required DbSet<ReadingList> ReadingLists { get; set; }
        public required DbSet<Category> Categories { get; set; }
        public required DbSet<Tag> Tags { get; set; }
        public required DbSet<Author> Authors { get; set; }
    }
}