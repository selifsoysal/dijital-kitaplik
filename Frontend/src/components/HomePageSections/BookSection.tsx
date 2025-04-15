import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookCard from '../Cards/BookCard';

const BooksSection: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/books')
      .then((response) => response.json())
      .then((data) => {
        const sortedBooks = data.sort((a: any, b: any) => b.id - a.id).slice(0, 5);
        setBooks(sortedBooks);
      })
      .catch((error) => console.error('Error fetching books:', error));
  }, []);

  const handleBookClick = (bookId: number) => {
    navigate(`/book/${bookId}`);
  };

  const handleAuthorClick = (authorId: number) => {
    navigate(`/author/${authorId}`);
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Son Eklenen Kitaplar</h2>
        <Link to="/books" className="btn btn-link text-decoration-none" style={{color: "rgb(118,187,175"}}>
          Tümünü Gör →
        </Link>
      </div>
      <div className="row row-cols-2 row-cols-md-5">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className="col">
              <BookCard
                title={book.title}
                coverImagePath={`http://localhost:5000/${book.coverImagePath}`}
                author={book.author.name}
                authorId={book.author.id}
                onBookClick={() => handleBookClick(book.id)}
                onAuthorClick={() => handleAuthorClick(book.author.id)}
                onAddToReadingList={() => console.log('Add to Reading List clicked')}
                bookId={book.id}
              />
            </div>
          ))
        ) : (
          <p>Yükleniyor...</p>
        )}
      </div>
    </div>
  );
};

export default BooksSection;
