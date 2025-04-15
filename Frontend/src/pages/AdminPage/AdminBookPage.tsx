import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import AdminBookCard from '../../components/Cards/AdminBookCard';
import FiltersSidebar from '../../components/FiltersSidebar/FiltersSidebar';
import AddBookModal from '../../components/Modals/AddBookModal'; // Modal component import
import '../BookPage/BooksPage.css';

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

const AdminBookPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);

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
      <div>
      <Button className="btn-addd-book mb-3" variant="success" onClick={() => setShowAddModal(true)}>Kitap Ekle</Button>
      <AddBookModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onBookAdded={fetchBooks}
      />
        <div className="books-list">
          {filteredBooks.length === 0 ? (
            <p>No books available.</p>
          ) : (
            filteredBooks.map((book) => (
              <div key={book.id} className="book-card-container">
                <AdminBookCard
                  title={book.title}
                  coverImagePath={`http://localhost:5000/${book.coverImagePath}`}
                  author={book.author.name}
                  bookId={book.id}
                  onBookUpdated={fetchBooks}
                  onBookDeleted={fetchBooks}
                />
              </div>
            ))
          )}
        </div>
        </div>
    </div>
  );
};

export default AdminBookPage;
