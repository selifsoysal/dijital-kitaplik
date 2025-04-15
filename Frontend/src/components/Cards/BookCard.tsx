import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // React Router kullanıyoruz
import './BookCard.css';
import ReadingListModal from "../Modals/ReadingListModal";

interface BookCardProps {
  title: string;
  coverImagePath: string;
  author: string;
  authorId: number;
  onBookClick: (bookId: number) => void;
  onAuthorClick: () => void;
  onAddToReadingList: (bookId: number) => void;
  bookId: number;
  showAddButton?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({
  title,
  coverImagePath,
  author,
  authorId,
  onBookClick,
  onAuthorClick,
  bookId,
  showAddButton = true,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showAddLink, setShowAddLink] = useState(false);
  const navigate = useNavigate();

  const handleBookClick = () => {
    onBookClick(bookId);
    navigate(`/book-details/${bookId}`);
  };

  return (
    <>
      <div className="book-card" onClick={handleBookClick} style={{ cursor: "pointer" }}>
        <div
          className="book-image-container"
          onMouseEnter={() => setShowAddLink(true)}
          onMouseLeave={() => setShowAddLink(false)}
        >
          <img src={coverImagePath} alt={title} className="book-cover" />
          {showAddButton && showAddLink && (
            <div className="add-to-reading-list">
              <button className="buton bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal(true);
                }}
              >
                Okuma Listesine Ekle
              </button>
            </div>
          )}
        </div>
        <h3 className="book-title">{title}</h3>
        <p className="book-author">
          <span
            onClick={(e) => {
              e.stopPropagation();
              onAuthorClick();
            }}
            className="author-link" style={{color: "rgb(118,187,175"}}
          >
            {author}
          </span>
        </p>
      </div>
            <ReadingListModal
        show={showModal}
        onClose={() => setShowModal(false)}
        bookId={bookId}
      />
    </>
  );
};

export default BookCard;
