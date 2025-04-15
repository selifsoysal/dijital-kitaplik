import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookCard from '../../components/Cards/BookCard';
import FiltersSidebar from '../../components/FiltersSidebar/FiltersSidebar';
import './BooksPage.css';

interface Book {
  id: number;
  title: string;
  description: string;
  coverImagePath: string;
  author: {
    name: string;
    id: number;
  };
  tags: { name: string }[];
  category: {
    name: string;
  };
}

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books');
      if (!response.ok) {
        throw new Error(`Error fetching books: ${response.statusText}`);
      }
      const data = await response.json();
      setBooks(data);
      setFilteredBooks(data);

      const authorsList: string[] = Array.from(new Set(data.map((book: Book) => book.author.name)));
      const tagsList: string[] = Array.from(new Set(data.flatMap((book: Book) => book.tags.map(tag => tag.name))));
      const categoriesList: string[] = Array.from(new Set(data.map((book: Book) => book.category.name)));

      setAuthors(authorsList);
      setTags(tagsList);
      setCategories(categoriesList);
    } catch (error) {
      console.error('Error fetching books:', error);
      alert('Error fetching books');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleFilterChange = () => {
    let filtered = books;

    if (selectedAuthor) {
      filtered = filtered.filter(book => book.author.name === selectedAuthor);
    }
    if (selectedCategory) {
      filtered = filtered.filter(book => book.category.name === selectedCategory);
    }
    if (selectedTags.length > 0) {
      filtered = filtered.filter(book =>
        selectedTags.every(tag => book.tags.some(t => t.name === tag))
      );
    }

    setFilteredBooks(filtered);
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedAuthor, selectedCategory, selectedTags, books]);

  const handleBookClick = (bookId: number) => {
    navigate(`/book/${bookId}`);
  };

  const handleAuthorClick = (authorId: number) => {
    navigate(`/author/${authorId}`);
  };

  return (
    <div className="books-page">
      <FiltersSidebar
        authors={authors}
        tags={tags}
        categories={categories}
        selectedCategory={selectedCategory}
        selectedTags={selectedTags}
        selectedAuthor={selectedAuthor}
        setSelectedCategory={setSelectedCategory}
        setSelectedTags={setSelectedTags}
        setSelectedAuthor={setSelectedAuthor}
      />

      <div className="book-list">
        {filteredBooks.length === 0 ? (
          <p>No books available.</p>
        ) : (
          filteredBooks.map((book) => (
            <div key={book.id} className="book-card-container">
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
        )}
      </div>
    </div>
  );
};

export default BooksPage;
