import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BookCard from '../../components/Cards/BookCard'; // BookCard bileşenini import et
import './AuthorDetailsPage.css';

interface Book {
  id: number;
  title: string;
  coverImagePath: string;
  authorId: number;
}

interface Author {
  id: number;
  name: string;
  bio: string;
  profileImagePath: string;
}

const AuthorDetailsPage: React.FC = () => {
  const { authorId } = useParams<{ authorId: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAuthorDetails = async () => {
      try {
        setLoading(true);

        const authorResponse = await fetch(`http://localhost:5000/api/authors/${authorId}`);
        if (!authorResponse.ok) {
          throw new Error('Error fetching author details');
        }
        const authorData = await authorResponse.json();
        setAuthor(authorData);

        const booksResponse = await fetch(`http://localhost:5000/api/books/author/${authorId}`);
        if (!booksResponse.ok) {
          throw new Error('Error fetching author books');
        }
        const booksData = await booksResponse.json();
        setBooks(booksData);
      } catch (error) {
        console.error('Error fetching author details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorDetails();
  }, [authorId]);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!author) {
    return <div>Error: Author not found.</div>;
  }

  return (
    <div className="author-details-page">
      <div className="author-info">
        <img
          src={`http://localhost:5000/${author.profileImagePath}`}
          alt={author.name}
          className="author-image"
        />
        <div>
          <h1>{author.name}</h1>
          <p>{author.bio}</p>
        </div>
      </div>

      <h2>Kitapları</h2>
      <div className="books-list">
        {books.length > 0 ? (
          books.map((book) => (
            <BookCard
              key={book.id}
              title={book.title}
              coverImagePath={`http://localhost:5000/${book.coverImagePath}`}
              authorId={book.authorId}
              bookId={book.id}
              onBookClick={() => console.log('Book clicked', book.id)}
              onAuthorClick={() => console.log('Author clicked', author.id)}
              onAddToReadingList={() => console.log('Add to reading list', book.id)} author={''}            />
          ))
        ) : (
          <p>No books available for this author.</p>
        )}
      </div>
    </div>
  );
};

export default AuthorDetailsPage;
