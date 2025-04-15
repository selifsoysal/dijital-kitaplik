// AuthorCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './AuthorCard.css';

interface AuthorCardProps {
  name: string;
  profileImagePath: string;
  id: number;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ name, profileImagePath, id }) => {
  return (
    <div className="author-card">
      <Link to={`/author/${id}`} className="text-decoration-none">
        <div className="author-image-container">
          <img
            src={`http://localhost:5000/${profileImagePath}`}
            alt={name}
            className="author-image"
          />
        </div>
        <h3 className="author-name">{name}</h3>
      </Link>
    </div>
  );
};

export default AuthorCard;
