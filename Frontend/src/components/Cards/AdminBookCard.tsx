import React, { useState } from "react";
import './BookCard.css';
import UpdateBookModal from "../Modals/UpdateBookModal";
import axios from 'axios'; // axios'u import ediyoruz

interface AdminBookCardProps {
  title: string;
  coverImagePath: string;
  author: string;
  bookId: number;
  onBookUpdated: () => void;
  onBookDeleted: () => void;
}

const AdminBookCard: React.FC<AdminBookCardProps> = ({
  title,
  coverImagePath,
  author,
  bookId,
  onBookUpdated,
  onBookDeleted
}) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${bookId}`);
      onBookDeleted();
    } catch (error) {
      console.error("Kitap silinirken bir hata oluştu:", error);
    }
  };

  return (
    <>
      <div className="book-card" style={{ cursor: "pointer"}}>
        <div className="book-image-container">
          <img src={coverImagePath} alt={title} className="book-cover" />
        </div>
        <h3 className="book-title">{title}</h3>
        <p className="book-author">{author}</p>
        <div className="admin-actions" style={{display: "flex", gap:"0.5em", padding: "10px"}} >
          <button
            className="btn btn-primary"
            onClick={() => setShowUpdateModal(true)}
            style={{ width: "100%" }}
          >
            Düzenle
          </button>
          <br />
          <button
            className="btn btn-danger"
            onClick={handleDelete}
            style={{ width: "100%" }}
          >
            Sil
          </button>
        </div>
      </div>
      <UpdateBookModal
        show={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        bookId={bookId}
        onBookUpdated={onBookUpdated}
      />
    </>
  );
};

export default AdminBookCard;
