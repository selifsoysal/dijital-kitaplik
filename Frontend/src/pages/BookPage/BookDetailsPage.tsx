import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // For navigation and parameters
import { Container, Row, Col } from "react-bootstrap";
import './BookDetailsPage.css';

interface BookDetailsProps {}

const BookDetailsPage: React.FC<BookDetailsProps> = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (bookId) {
      fetch(`http://localhost:5000/api/books/${bookId}`)
        .then((response) => response.json())
        .then((data) => setBook(data))
        .catch((error) => console.error("Error fetching book details:", error));
    }
  }, [bookId]);

  if (!book) {
    return <div>Loading...</div>;
  }

  const handleCategoryClick = (category: string) => {
    navigate(`/books?category=${category}`);
  };

  const handleAuthorClick = (authorId: number) => {
    navigate(`/author/${authorId}`);
  };

  const handleTagClick = (tag: string) => {
    navigate(`/books?tag=${tag}`);
  };

  return (
    <Container className="book-details mt-5">
      <Row>
        <Col md={8}>
          <h1>{book.title}</h1>
          <p>{book.description}</p>
          <p>
            <strong>Sayfa Sayısı:</strong> {book.pageCount}
          </p>
          <p>
            <strong>Kategori:</strong>{" "}
            <span
              onClick={() => handleCategoryClick(book.category.name)}
              style={{ color: "blue", cursor: "pointer" }}
            >
              {book.category.name}
            </span>
          </p>
          <p>
            <strong>Yazar:</strong>{" "}
            <span
              onClick={() => handleAuthorClick(book.author.id)}
              style={{ color: "blue", cursor: "pointer" }}
            >
              {book.author.name}
            </span>
          </p>
          <ul>
            <strong>Etiketler:</strong>
            {book.tags.length > 0 ? (
              book.tags.map((tag: { id: number; name: string }) => (
                <li key={tag.id}>
                  <span
                    onClick={() => handleTagClick(tag.name)}
                    style={{ color: "blue", cursor: "pointer" }}
                  >
                    {tag.name}
                  </span>
                </li>
              ))
            ) : (
              <li>No tags</li>
            )}
          </ul>
        </Col>

        <Col md={4}>
          <img
            src={`http://localhost:5000/${book.coverImagePath}`}
            alt={book.title}
            className="book-cover img-fluid"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default BookDetailsPage;
